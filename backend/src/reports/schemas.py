from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime

class ReportBase(BaseModel):
    report_type: str
    parameters: Dict[str, Any]

class ReportCreate(ReportBase):
    pass

class ReportInDB(ReportBase):
    id: int
    user_id: int
    result: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True

class Report(ReportInDB):
    pass

class SalesReportParams(BaseModel):
    start_date: datetime
    end_date: datetime
    category: Optional[str] = None

class InventoryReportParams(BaseModel):
    low_stock_threshold: Optional[int] = None
    category: Optional[str] = None 