from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class ProductBase(BaseModel):
    code: str
    name: str
    category: str
    price: float
    is_active: bool = True
    description: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    is_active: Optional[bool] = None
    description: Optional[str] = None

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProductList(BaseModel):
    items: List[Product]
    total: int
    page: int
    size: int
