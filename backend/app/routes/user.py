from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Any

# core
# session
from app.core.session import get_db
# security
from app.core.security import validate_user_token, create_password_hash,verify_password_hash

# services
from app.services import user_service

# utils
# helpers
from app.utils import user_helper
# exceptions
from app.utils.exceptions import THROW_ERROR

# schemas
from app.models.schemas.user_schema import AdvancedUsersProfileBase, AdvancedUsersProfileOut, UserChangePassword,UserOut, UserChangeEmail

router = APIRouter(prefix="/user", tags=["user"])

# update / create user profile
@router.patch("/update-user/", response_model=AdvancedUsersProfileOut, name="updateUserProfile")
def user_profile(
    payload: AdvancedUsersProfileBase,
    user_id = Depends(validate_user_token),
    db: Session = Depends(get_db)
):
    user = user_service.user_profile_finder(user_id, db)
    if user is False:
        user_service.create_new_profile(user_id, db)

    data: dict[str, any] = payload.model_dump(exclude_unset=True)

    if not data:
        THROW_ERROR("No changes provided!", 400)

    for item, value in data.items():
        if item == "username":
            user_helper.validate_username(value)
            existing_user = user_service.username_finder(value, db)
            if existing_user and existing_user.user_id != user_id:
                THROW_ERROR("Username already in use!", 400)

        elif item == "avatar_url":
                user_helper.validate_avatar_url(value)
        elif item == "address":
                user_helper.validate_address(value)
        elif item == "country":
                user_helper.validate_country(value)
        elif item == "phone_number":
                user_helper.validate_phone_number(value)

    return user_service.update_user_profile(user, data, db)

# change email
@router.put("/change-email/", response_model=UserOut, name="changeUserEmail")
def change_email(
    payload: UserChangeEmail,
    user_id = Depends(validate_user_token),
    db: Session = Depends(get_db)
):
    email = payload.email
    user = user_service.get_user_from_id(user_id, db)
    if user.email == email:
        THROW_ERROR("Cant update your email to the same email!",400)

    if user_service.email_finder(email, db):
        THROW_ERROR("Email already in use!", 400)

    return user_service.update_email(email, user_id, db)

# change password
@router.put("/change-password/", response_model=UserOut, name="changeUserPassword")
def change_password(
    payload: UserChangePassword,
    user_id = Depends(validate_user_token),
    db: Session = Depends(get_db)
):
    user = user_service.get_user_from_id(user_id, db)
     
    if payload.password == payload.new_password:
        THROW_ERROR("Passwords cant be the same!", 400)

    if verify_password_hash(payload.password, user.password_hash) is not True:
        THROW_ERROR("The password doesnt correspond to the old one!", 400)

    new_password = create_password_hash(payload.new_password)

    if new_password == user.password_hash:
        THROW_ERROR("You cant change the password to your old password!", 400)

    return user_service.update_password(new_password, user_id, db)

# get user profile
@router.get("/user", response_model=dict, name="user")
def get_user(
    user_id = Depends(validate_user_token),
    db: Session = Depends(get_db)
):
    user = user_service.get_user_from_id(user_id, db)
    user_profile = user_service.user_profile_finder(user_id, db)

    if user and user_profile:
        info = {
            "email": user.email,
            "username": user_profile.username,
            "avatar": user_profile.avatar_url,
            "last_login": user.last_login
        }
    elif user:
        info = {
            "email": user.email,
            "last_login": user.last_login
        }
    else:
        THROW_ERROR("No user has been found!", 400)

    return info



