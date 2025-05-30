from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from datetime import datetime

class WidgetConfig(BaseModel):
    type: str  # sales_chart, inventory_status, etc.
    config: Dict[str, Any]

class DashboardBase(BaseModel):
    name: str
    layout: Dict[str, Any]
    widgets: List[WidgetConfig]

class DashboardCreate(DashboardBase):
    pass

class DashboardUpdate(BaseModel):
    name: Optional[str] = None
    layout: Optional[Dict[str, Any]] = None
    widgets: Optional[List[WidgetConfig]] = None

class DashboardInDB(DashboardBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Dashboard(DashboardInDB):
    pass

class DashboardStats(BaseModel):
    total_sales: float
    total_orders: int
    low_stock_items: int
    recent_orders: List[Dict[str, Any]]
    top_products: List[Dict[str, Any]] 