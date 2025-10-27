from sqlalchemy.orm import Session
from typing import Mapping, Any

# models
from app.models.user_model import User, AdvancedUsersProfile
# schemas
from app.models.schemas.user_schema import AdvancedUsersProfileBase

# utils
# exceptions
from app.utils.exceptions import THROW_ERROR

def get_user_from_id(user_id: int, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        THROW_ERROR("Invalid user", 400)
    
    return user

"""
finders
"""

def email_finder(email: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    if user:
        return user
    
    return False

def username_finder(username: str, db:Session):
    user = db.query(AdvancedUsersProfile).filter(AdvancedUsersProfile.username == username).first()
    if user:
        return user
    
    return False

def user_profile_finder(user_id, db: Session):
    user = db.query(AdvancedUsersProfile).filter(AdvancedUsersProfile.user_id == user_id).first()
    if user:
        return user
    
    return False

"""
inserts | updates
"""

def create_new_profile(user_id: int, db: Session) -> bool:

    new_profile = AdvancedUsersProfile(
        user_id = user_id
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return True

def update_user_profile(payload: AdvancedUsersProfileBase, data: Mapping[str, any], db: Session):

    for item, value in data.items():
        setattr(payload, item, value)

    db.commit()
    db.refresh(payload)

    return payload

def update_email(email: str, user_id: int, db: Session):

    user = get_user_from_id(user_id,db)

    user.email = email

    db.commit()
    db.refresh(user)

    return user

def update_password(password: str, user_id: int, db: Session):

    user = get_user_from_id(user_id,db)

    user.password_hash = password

    db.commit()
    db.refresh(user)

    return user
