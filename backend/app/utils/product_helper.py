from typing import Optional
from decimal import Decimal, InvalidOperation
from pydantic import HttpUrl
import re

# utils
# exceptions
from app.utils.exceptions import THROW_ERROR


"""
input validatores
"""

def validate_product_name(value: Optional[str]) -> str:
    if value is None:
        THROW_ERROR("Product name cannot be blank.", 400)
    if not isinstance(value, str):
        THROW_ERROR("Product name is not in correct format", 400)

    product_name = value.strip()
    if not product_name:
        THROW_ERROR("Product name cannot be blank.", 400)

    if len(product_name) < 2:
        THROW_ERROR("Product name is too short.", 400)
    if len(product_name) > 100:
        THROW_ERROR("Product name is too long.", 400)

    pattern = re.compile(r'^[a-zA-Z0-9\s]+$')
    if pattern.match(product_name) is None: 
        THROW_ERROR("Product name can only contain letters, numbers, and spaces.", 400)


    return product_name

def validate_product_description(value: Optional[str]) -> str:
    if value is None:
        THROW_ERROR("Product description cannot be blank.", 400)
    if not isinstance(value, str):
        THROW_ERROR("Product description is not in correct format", 400)

    product_description = value.strip()
    if not product_description:
        THROW_ERROR("Product description cannot be blank.", 400)

    if len(product_description) < 1:
        THROW_ERROR("Product description is too short.", 400)
        
    if len(product_description) > 1000:
        THROW_ERROR("Product description to long.", 400)

    if re.search(r"<[^>]+>", product_description):
        THROW_ERROR("Product description cannot contain HTML or script tags.", 400)

    return product_description

def validate_product_stock(value: Optional[int]) -> int:
    if value is None:
        THROW_ERROR("Product needs a valid number for available stock", 400)
    if not isinstance(value, int):
        THROW_ERROR("Product stock is not in correct format", 400)

    if value < 0:
        THROW_ERROR("Product stock cannot be negative.", 400)
    if value > 999999:
        THROW_ERROR("Product stock cannot exceed 999,999 units.", 400)

    return value

def validate_product_price(value: Optional[Decimal]) -> Decimal:
    if value is None:
        THROW_ERROR("Product price is required.", 400)

    try:
        product_price = Decimal(value)
    except (InvalidOperation, TypeError):
        THROW_ERROR("Product price must be a valid decimal.", 400)

    if product_price < 0:
        THROW_ERROR("Product price cannot be negative.", 400)

    if product_price > Decimal("999999.99"):
        THROW_ERROR("Product price is unrealistically high.", 400)

    return product_price.quantize(Decimal("0.01"))

def validate_product_cost(value: Optional[Decimal]) -> Decimal:
    if value is None:
        return None

    try:
        product_cost = Decimal(value)
    except (InvalidOperation, TypeError):
        THROW_ERROR("Product cost must be a valid decimal.", 400)

    if product_cost < 0:
        THROW_ERROR("Product cost cannot be negative.", 400)

    if product_cost > Decimal("999999.99"):
        THROW_ERROR("Product cost is unrealistically high.", 400)

    return product_cost.quantize(Decimal("0.01"))

def validate_product_platform(value: Optional[str]) -> str:
    if value is None:
        THROW_ERROR("Product platform cannot be blank.", 400)
    if not isinstance(value, str):
        THROW_ERROR("Product platform is not in correct format", 400)

    product_platform = value.strip()
    if not product_platform:
        THROW_ERROR("Product platform cannot be blank.", 400)

    if len(product_platform) < 2:
        THROW_ERROR("Product platform is too short.", 400)
    
    if len(product_platform) > 35:
        THROW_ERROR("Product platform is too Long.", 400)

    return product_platform

def validate_product_img_url(value: Optional[str]) -> str:
    if value is None:
        return None

    try:
        url = HttpUrl(value)
        return str(url)
    except Exception:
        THROW_ERROR("Invalid URL format for img.", 400)
    


        