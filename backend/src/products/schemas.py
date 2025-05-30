from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    sku: str
    price: float
    stock: int = 0
    category: str
    attributes: Dict[str, str] = {}
    images: List[str] = ["/placeholder.svg"]

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category: Optional[str] = None
    attributes: Optional[Dict[str, str]] = None
    images: Optional[List[str]] = None

class Product(ProductBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 