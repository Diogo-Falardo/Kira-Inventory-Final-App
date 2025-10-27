import re
from typing import Optional
from pydantic import HttpUrl

# external lib imports
from email_validator import validate_email as ValidEmail, EmailNotValidError

# utils
# excepions
from app.utils.exceptions import THROW_ERROR

"""
input validatores
"""

def validate_email(value: Optional[str]) -> str:
    if value is None:
        THROW_ERROR("Email cannot be blank.", 400)
    if not isinstance(value, str):
        THROW_ERROR("Email is not in correct format", 400)

    email = value.strip()
    if not email:
        THROW_ERROR("Email cannot be blank.", 400)

    try:
        info = ValidEmail(email, check_deliverability=True)
        # cleans email
        return info.normalized
    except EmailNotValidError as e:
        THROW_ERROR(f"Invalid email: {str(e)}", 400)
    
def validate_password(value: Optional[str])-> str:
    if value is None:
        THROW_ERROR("Password cannot be blank.", 400)
    if not isinstance(value, str):
        THROW_ERROR("Password is not in the correct format", 400)

    password = value.strip()
    if not password:
        THROW_ERROR("Password cannot be blank.", 400)
 
    if len(password) < 6:
        THROW_ERROR("Password is to short!", 400)
    if len(password) > 128:
        THROW_ERROR("Password is to long!", 400)
    
    password_pattern = r"^(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).{6,}$"
    if not re.match(password_pattern, password):
        THROW_ERROR("Passowrd need at least 6 characters, 1 letter upercase, 1 lowercase and 1 simbol!", 400)

    return password

def validate_username(value: Optional[str]) -> str:
    if value is None:
        THROW_ERROR("Username cannot be blank.", 400)
    if not isinstance(value, str):
        THROW_ERROR("Username is not in the correct format", 400)
    
    username = value.strip()
    if not username:
        THROW_ERROR("Username cannot be blank.", 400)

    if len(username) < 3:
        THROW_ERROR("Username is to short!", 400)
    if len(username) > 15:
        THROW_ERROR("Username is to long!", 400)
    
    underscore_pattern = r"^[A-Za-z0-9_]+$"
    if not re.fullmatch(underscore_pattern, username):
        THROW_ERROR("Username can only contain letters,numbers and _(underscore)!", 400)

    return username

def validate_phone_number(value: Optional[str]) -> int: 
    if value is None:
        THROW_ERROR("Phone number cannout be blank.", 400)
    if not isinstance(value, str):
        THROW_ERROR("Phone number is not in the correct format", 400)
    
    phone_number = value.strip()
    if not phone_number:
        THROW_ERROR("Phone number cannout be blank.", 400)

    if not phone_number:
        THROW_ERROR("Phone number is required", 400)

    if len(phone_number) < 4 or len(phone_number) > 25:
        THROW_ERROR("Invalid phone number!", 400)

    return phone_number

def validate_avatar_url(value: Optional[str]) -> str:
    if value is None:
        return None

    try:
        url = HttpUrl(value)
        return str(url)
    except Exception:
        THROW_ERROR("Invalid URL format for avatar.", 400)

def validate_address(value: Optional[str]) -> str:
    if value is None:
        return None

    address = value.strip()

    if not address:
        THROW_ERROR("Address cannot be blank.", 400)

    if not isinstance(address, str):
        THROW_ERROR("Address must be a string.", 400)

    if len(address) < 5:
        THROW_ERROR("Address is too short.", 400)

    if len(address) > 120:
        THROW_ERROR("Address is too long.", 400)

    return address

def validate_country(value: Optional[str]) -> str:
    if value is None:
        return None

    country = value.strip()

    if not country:
        THROW_ERROR("Country cannot be blank.", 400)

    if not isinstance(country, str):
        THROW_ERROR("Country must be a string.", 400)

    if len(country) < 2:
        THROW_ERROR("Country is too short.", 400)

    if len(country) > 56:
        THROW_ERROR("Country name is too long.", 400)

    if not re.match(r"^[A-Za-zÀ-ÿ\s'-]+$", country):
        THROW_ERROR("Country must only contain letters and spaces.", 400)

    return country






