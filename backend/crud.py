# app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_products(db: Session):
    return db.query(models.Product).all()

def delete_product(db: Session, product_id: int):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        return None  # Handle product not found
    db.delete(product)
    db.commit()
    return product

    
def update_product(db: Session, product_id: int, product: schemas.ProductUpdate):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        return None  # Handle product not found
    for key, value in product.dict().items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product


def create_sale(db: Session, sale: schemas.SaleCreate):
    product = db.query(models.Product).filter(models.Product.id == sale.product_id).first()
    if not product or product.stock < sale.quantity:
        return None  # Handle insufficient stock

    total_price = sale.quantity * product.price
    product.stock -= sale.quantity

    db_sale = models.Sale(
        product_id=sale.product_id,
        quantity=sale.quantity,
        total_price=total_price
    )

    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

def get_sales(db: Session):
    return db.query(models.Sale).all()
