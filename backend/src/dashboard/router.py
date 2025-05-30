from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Dict
from src.database import get_db
from src.dashboard import schemas, models
from src.auth.dependencies import get_current_user
from src.dashboard.crud import (
    create_dashboard,
    get_dashboard,
    get_dashboards,
    update_dashboard,
    delete_dashboard,
    get_dashboard_stats
)
from src.dashboard.service import DashboardService
from src.auth.schemas import SUser

router = APIRouter()

@router.post("/", response_model=schemas.Dashboard)
def create_new_dashboard(
    dashboard: schemas.DashboardCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return create_dashboard(db=db, dashboard=dashboard, user_id=current_user.id)

@router.get("/{dashboard_id}", response_model=schemas.Dashboard)
def read_dashboard(
    dashboard_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_dashboard = get_dashboard(db, dashboard_id=dashboard_id)
    if db_dashboard is None:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    if not current_user.is_superuser and db_dashboard.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return db_dashboard

@router.get("/", response_model=List[schemas.Dashboard])
def read_dashboards(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Если пользователь не админ, показываем только его дашборды
    user_id = None if current_user.is_superuser else current_user.id
    dashboards = get_dashboards(db, skip=skip, limit=limit, user_id=user_id)
    return dashboards

@router.put("/{dashboard_id}", response_model=schemas.Dashboard)
def update_dashboard_info(
    dashboard_id: int,
    dashboard: schemas.DashboardUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_dashboard = get_dashboard(db, dashboard_id=dashboard_id)
    if db_dashboard is None:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    if not current_user.is_superuser and db_dashboard.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    db_dashboard = update_dashboard(db, dashboard_id=dashboard_id, dashboard=dashboard)
    return db_dashboard

@router.delete("/{dashboard_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dashboard_info(
    dashboard_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_dashboard = get_dashboard(db, dashboard_id=dashboard_id)
    if db_dashboard is None:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    if not current_user.is_superuser and db_dashboard.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    if not delete_dashboard(db, dashboard_id=dashboard_id):
        raise HTTPException(status_code=404, detail="Dashboard not found")
    return None

@router.get("/stats/overview", response_model=schemas.DashboardStats)
def get_overview_stats(
    days: int = Query(30, ge=1, le=365, description="Number of days to include in statistics"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return get_dashboard_stats(db, days=days)

@router.get("/dashboard")
async def get_dashboard_data(
    current_user: SUser = Depends(get_current_user)
) -> Dict:
    if current_user.role not in ["admin", "manager", "analyst"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для просмотра дашборда"
        )
    
    return await DashboardService.get_dashboard_data() 