from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict
from datetime import datetime

from src.database import get_db
from src.reports import schemas, models
from src.auth.dependencies import get_current_user
from src.reports.crud import (
    create_report,
    get_report,
    get_reports
)
from src.reports.service import ReportService
from src.auth.schemas import SUser

router = APIRouter()

@router.post("/", response_model=schemas.Report)
def create_new_report(
    report: schemas.ReportCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        return create_report(db=db, report=report, user_id=current_user.id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/{report_id}", response_model=schemas.Report)
def read_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_report = get_report(db, report_id=report_id)
    if db_report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    if not current_user.is_superuser and db_report.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return db_report

@router.get("/", response_model=List[schemas.Report])
def read_reports(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Если пользователь не админ, показываем только его отчеты
    user_id = None if current_user.is_superuser else current_user.id
    reports = get_reports(db, skip=skip, limit=limit, user_id=user_id)
    return reports

@router.get("/reports/{report_type}")
async def get_report(
    report_type: str,
    start_date: datetime,
    end_date: datetime,
    current_user: SUser = Depends(get_current_user)
) -> Dict:
    if current_user.role not in ["admin", "manager", "analyst"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для просмотра отчетов"
        )

    if report_type == "sales":
        return await ReportService.get_sales_report(start_date, end_date)
    elif report_type == "products":
        return await ReportService.get_products_report(start_date, end_date)
    elif report_type == "customers":
        return await ReportService.get_customers_report(start_date, end_date)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Неизвестный тип отчета"
        ) 