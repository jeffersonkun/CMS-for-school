from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class Customer(BaseModel):
    id: str
    name: str
    email: str
    phone: str

class OrderItemBase(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: str

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    customer: Customer
    items: List[OrderItemCreate]
    discount: float = 0
    shipping: float = 0
    payment_method: str

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    discount: Optional[float] = None
    shipping: Optional[float] = None
    payment_method: Optional[str] = None

class Order(OrderBase):
    id: str
    number: str
    subtotal: float
    total: float
    status: str
    created_at: datetime
    updated_at: datetime
    items: List[OrderItem]

    class Config:
        from_attributes = True 