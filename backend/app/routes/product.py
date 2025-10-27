from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Any
from enum import Enum

# core
# session
from app.core.session import get_db
# security
from app.core.security import validate_user_token

# schemas
from app.models.schemas.product_schema import ProductCreate,ProductUpdate,ProductOut

# utils
# exceptions
from app.utils.exceptions import THROW_ERROR
# helpers
from app.utils import product_helper

# services
from app.services import product_service

router = APIRouter(prefix="/product", tags=["product"])

# create a product
@router.post("/add-product", response_model=ProductOut, name="addProduct")
def create_product(
    payload: ProductCreate,
    user_id = Depends(validate_user_token),
    db: Session = Depends(get_db)
):
    if product_service.duplicated_product(payload.name, user_id, db) is True:
        THROW_ERROR("There is already a product with that name", 400)

    data = payload.model_dump(exclude_unset=True)

    for item, value in data.items():
        if item == "description":
            product_helper.validate_product_description(value)
        elif item == "cost":
            product_helper.validate_product_cost(value)
        elif item == "platform":
            product_helper.validate_product_platform(value)
        elif item == "img_url":
            product_helper.validate_product_img_url(value)

    return product_service.create_new_product(data, user_id, db)

# update a product
@router.patch("/update-product/{product_id}", response_model=ProductOut, name="updateProduct")
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    user_id = Depends(validate_user_token)
):
    data: dict[str, Any] = payload.model_dump(exclude_unset=True)

    if not data:
        THROW_ERROR("No data provided!", 400)

    for item, value in data.items():
        if item == "name":
            product_helper.validate_product_name(value)
            if product_service.duplicated_product(payload.name, user_id, db) is True:
                THROW_ERROR("There is already a product with that name", 400)
        elif item == "description":
            product_helper.validate_product_description(value)
        elif item == "available_stock":
            product_helper.validate_product_stock(value)
        elif item == "price":
            product_helper.validate_product_price(value)
        elif item == "cost":
            product_helper.validate_product_cost(value)
        elif item == "platform":
            product_helper.validate_product_platform(value)
        elif item == "img_url":
            product_helper.validate_product_img_url(value)

    product = product_service.verify_product_owner(product_id, user_id, db)

    return product_service.update_product(product,data,db)

# inactive product
@router.put("/inactive-product/{product_id}", response_model=ProductOut, name="inactiveProduct")
def inactive_product(
    product_id: int,
    user_id = Depends(validate_user_token),
    db: Session = Depends(get_db)
):
    product = product_service.verify_product_owner(product_id,user_id,db)

    return product_service.update_product_state(product,db)


# delete a product -> delete from the db
@router.delete("/delete-product/{product_id}", response_model=dict, name="deleteProduct")
def delete_product(
    product_id: int,
    user_id = Depends(validate_user_token),
    db: Session = Depends(get_db),
):
    product = product_service.verify_product_owner(product_id,user_id,db)

    return product_service.remove_product(product,db)

class Order(str, Enum):
    asc = "asc"
    desc = "desc"

# list of all products
@router.get("/my-products", response_model=list[ProductOut], name="myProducts")
def user_products(
    user_id = Depends(validate_user_token),
    db: Session = Depends(get_db),
    order: Order = Query(Order.desc),
):
    return product_service.all_products(user_id, db, order)

# stock stats and price of all
@router.get("/products-available/", response_model=dict, name="productsAvailable")
def products_available(
    user_id = Depends(validate_user_token),
    db: Session = Depends(get_db),
):
    return product_service.number_of_products_available(user_id, db)

# TOP [3]
# most lucrative products
@router.get("/top-lucrative-products/", response_model=dict, name="topLucrativeProducts")
def lucrative_products(
    user_id = Depends(validate_user_token),
    db: Session = Depends(get_db),
): 
    return product_service.high_valued_products(user_id, db)

# low or non profit products
@router.get("/worst-lucrative-products/", response_model=dict, name="worstLucrativeProducts")
def non_profitable_products(
    user_id = Depends(validate_user_token),
    db: Session = Depends(get_db),
):
    return product_service.low_valued_products(user_id, db)

# value of stock and profit
@router.get("/estimated-profit/", response_model=dict ,name="estimatedProfit")
def profit(
    user_id = Depends(validate_user_token),
    db: Session = Depends(get_db),
):
    return product_service.profit(user_id, db)

# products that are low on stock
@router.get("/low-stock-items/{quantity}", response_model=dict, name="lowStockItems")
def low_stock(
    quantity: int,
    user_id = Depends(validate_user_token),
    db: Session = Depends(get_db),
):
    return product_service.low_stock_products(quantity,user_id,db)
    