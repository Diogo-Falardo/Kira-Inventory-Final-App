from sqlalchemy.orm import Session
from typing import Mapping, Any
from enum import Enum

# models
from app.models.product_model import Product
# schemas
from app.models.schemas.product_schema import ProductCreate, ProductUpdate

# utils
# exceptions
from app.utils.exceptions import THROW_ERROR
# helpers
from app.utils import product_helper

# verify if not duplicated product name
def duplicated_product(product_name: str, user_id: int, db: Session) -> bool:

    product = db.query(Product).filter(Product.name == product_name, Product.user_id == user_id).first()
    if product:
        return True
    
    return False

# verify if the user is the onwer of that product if is return [product]
def verify_product_owner(product_id: int, user_id: int, db: Session):
    product = db.query(Product).filter(Product.id == product_id, Product.user_id == user_id).first()
    if product is None:
        THROW_ERROR("Hmmm that doenst look good! are u sure thats your product??", 400)

    return product

"""
inserts | updates | delete
"""

def create_new_product(data: dict,user_id: int, db: Session):

    new_product = Product(
        user_id=user_id,
        name=data["name"],
        description=data.get("description"),
        available_stock=data["available_stock"],
        price=data["price"],
        cost=data.get("cost"),
        platform=data.get("platform"),
        img_url=data.get("img_url"),
        inactive=data.get("inactive", False),
    )


    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

def update_product(payload: ProductUpdate,data: Mapping[str, Any], db: Session):

    for item, value in data.items():
        setattr(payload, item, value)

    db.commit()
    db.refresh(payload)

    return payload

# if its true change for false || if its false change for true
def update_product_state(product: Product, db: Session):
    if product.inactive == 1:
        product.inactive = 0
    else:
        product.inactive = 1

    db.commit()
    db.refresh(product)
        
    return product

def remove_product(product: Product, db: Session):

    db.delete(product)
    db.commit()

    return product

"""
gets
"""
class Order(str, Enum):
    asc = "asc"
    desc = "desc"

def all_products(user_id: int, db: Session, order: Order = Order.asc):

    user_products = db.query(Product).filter(Product.user_id == user_id)   

    #asc
    if order == Order.asc:
        products = user_products.order_by(Product.created_at.asc()).all()
    # desc
    elif order == Order.desc:
        products = user_products.order_by(Product.created_at.desc()).all()

    else:
        THROW_ERROR("Invalid order!", 400)

    return products

def number_of_products_available(user_id: int, db: Session):

    products = db.query(Product).filter(Product.user_id == user_id).all()

    available_stock = 0
    total_price = 0
    for product in products:
        if product.available_stock > 1:
            available_stock += product.available_stock
            total_price += product.available_stock * product.price

    return{
        "available_stock": f"{available_stock}",
        "total_price": f"{total_price}"
    }

def high_valued_products(user_id: int, db: Session):
    products = db.query(Product).filter(Product.user_id == user_id).all()

    profitable = [product for product in products if product.price > product.cost]

    profitable.sort(key=lambda product: product.price - product.cost, reverse=True)

    top3 = profitable[:3]

    result = {
        product.name: {
            "profit": round(product.price - product.cost, 2)
        }
        for product in top3
    }

    return result

def low_valued_products(user_id: int, db: Session):
    products = db.query(Product).filter(Product.user_id == user_id).all()

    non_profitable = [product for product in products if product.price <= product.cost]

    non_profitable.sort(key=lambda product: product.price - product.cost)

    bottom3 = non_profitable[:3]

    result = {
        product.name: {
            "profit": round(product.price - product.cost, 2)
        }
        for product in bottom3
    }

    return result

def profit(user_id: int, db: Session):

    products = db.query(Product).filter(Product.user_id == user_id).all()

    profit_value = 0
    stock_cost = 0
    products_not_profitable = 0
    losses = []
    for product in products:
        profit_value += product.price * product.available_stock
        stock_cost += product.cost * product.available_stock
        if product.cost > product.price:
            products_not_profitable += 1
            loss_amout = round(product.cost - product.price, 3)
            losses.append({
                "name": product.name,
                "loss on each product": loss_amout
            })

    return {"stock cost":stock_cost,"profit":profit_value,"losing_products": losses}

def low_stock_products(quantity: int, user_id: int, db: Session):

    products = db.query(Product).filter(Product.user_id == user_id).all()

    low_stock = []
    for product in products:
        if product.available_stock < quantity:
            low_stock.append({
                "name": product.name,
                "stock available": product.available_stock
            })

    if len(low_stock) > 1:
        return {"You need more stock of ": low_stock}
    else:
        return {"detail": "Your stock is all good"}




