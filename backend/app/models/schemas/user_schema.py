from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict, Field, field_validator

# utils
# exceptions
from app.utils.exceptions import THROW_ERROR
# helpers
from app.utils import user_helper


# ---- Base ----
class UserBase(BaseModel):
    email: EmailStr
    plan_code: str = "free"

    @field_validator("email", mode="before")
    @classmethod
    def _email(cls, email):
        return user_helper.validate_email(email)
    

    @field_validator("plan_code", mode="before")
    @classmethod
    def plan_code_not_blank(cls, v: Optional[str]):
        if v is None:
            return "free"
        if isinstance(v, str) and not v.strip():
            THROW_ERROR("plan_code cannot be blank.", 400)
        return v.strip()


# ---- Create ----

class UserCreate(UserBase):
    password: str 

    @field_validator("password")
    @classmethod
    def _password(cls, password):
        return user_helper.validate_password(password)
    
class UserLogin(BaseModel):
    email: EmailStr

    @field_validator("email", mode="before")
    @classmethod
    def _email(cls, email):
        return user_helper.validate_email(email)

    password: str 

    @field_validator("password")
    @classmethod
    def _password(cls, password):
        return user_helper.validate_password(password)
    

# ---- Update (patch) ----

class UserChangePassword(BaseModel):
    password: str
    new_password: str

    @field_validator("password")
    @classmethod
    def _password(cls, password):
        return user_helper.validate_password(password)
    

    @field_validator("new_password")
    @classmethod
    def _new_password(cls, new_password):
        return user_helper.validate_password(new_password)

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    plan_code: Optional[str] = None
    plan_expires: Optional[datetime] = None
    is_admin: Optional[bool] = None


# ---- Read/Out ----
class UserOut(UserBase):
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# jwt -> token out
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

"""
ADVANCER USER SCHEMA
"""

# ---- Base ----
class AdvancedUsersProfileBase(BaseModel):
    username: Optional[str] = None
    avatar_url: Optional[str] = None 
    address: Optional[str] = None
    country: Optional[str] = None
    phone_number: Optional[str] = None


# ---- Read/Out ----
class AdvancedUsersProfileOut(AdvancedUsersProfileBase):

    model_config = ConfigDict(from_attributes=True)


""" OTHER """
class UserCompleted(BaseModel):
    email: EmailStr
    username: str