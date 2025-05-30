# app/schemas.py
from pydantic import BaseModel
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    price: float
    stock: int

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass


class Product(ProductBase):
    id: int

    class Config:
        orm_mode = True

class SaleBase(BaseModel):
    product_id: int
    quantity: int

class SaleCreate(SaleBase):
    pass

class SaleUpdate(SaleBase):
    pass




class Sale(SaleBase):
    id: int
    total_price: float
    date: datetime

    class Config:
        orm_mode = True
