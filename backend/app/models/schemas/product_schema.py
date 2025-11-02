from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict, field_validator, Field

# utils
# exceptions
from app.utils.exceptions import THROW_ERROR
# helpers
from app.utils import product_helper



# ---- Base ----
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    available_stock: int 
    price: Decimal
    cost: Optional[Decimal] = None
    platform: Optional[str] = None
    img_url: Optional[str] = None


    @field_validator("name")
    @classmethod
    def _name(cls, name):
        return product_helper.validate_product_name(name)
    
    @field_validator("available_stock")
    @classmethod
    def _available_stock(cls, available_stock):
        return product_helper.validate_product_stock(available_stock)

    @field_validator("price")
    @classmethod
    def price_non_negative(cls, price):
        return product_helper.validate_product_price(price)



# ---- Create ----
class ProductCreate(ProductBase):
    pass

class ProductDashboard(BaseModel):
    pass


# ---- Update (patch) ----
class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    available_stock: Optional[int] = None 
    price: Optional[Decimal] = None
    cost: Optional[Decimal] = None
    platform: Optional[str] = None
    img_url: Optional[str] = None

   
# ---- Read/Out ----
class ProductOut(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    inactive: bool

    model_config = ConfigDict(from_attributes=True)



# --- Delete ----
class ProductDeleteOut(ProductBase):
    deleted_at: datetime


    
