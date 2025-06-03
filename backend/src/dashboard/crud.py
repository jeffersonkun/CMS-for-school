from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from src.dashboard import models, schemas
from src.orders.models import Order, OrderItem
from src.products.models import Product
from datetime import datetime, timedelta

def get_dashboard(db: Session, dashboard_id: int):
    return db.query(models.Dashboard).filter(models.Dashboard.id == dashboard_id).first()

def get_dashboards(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    user_id: int = None
):
    query = db.query(models.Dashboard)
    if user_id:
        query = query.filter(models.Dashboard.user_id == user_id)
    return query.offset(skip).limit(limit).all()

def create_dashboard(db: Session, dashboard: schemas.DashboardCreate, user_id: int):
    db_dashboard = models.Dashboard(
        user_id=user_id,
        name=dashboard.name,
        layout=dashboard.layout,
        widgets=dashboard.widgets
    )
    db.add(db_dashboard)
    db.commit()
    db.refresh(db_dashboard)
    return db_dashboard

def update_dashboard(db: Session, dashboard_id: int, dashboard: schemas.DashboardUpdate):
    db_dashboard = get_dashboard(db, dashboard_id)
    if not db_dashboard:
        return None
    
    update_data = dashboard.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_dashboard, field, value)
    
    db.commit()
    db.refresh(db_dashboard)
    return db_dashboard

def delete_dashboard(db: Session, dashboard_id: int):
    db_dashboard = get_dashboard(db, dashboard_id)
    if not db_dashboard:
        return False
    db.delete(db_dashboard)
    db.commit()
    return True

def get_dashboard_stats(db: Session, days: int = 30):
    # Получаем статистику за последние N дней
    start_date = datetime.now() - timedelta(days=days)
    
    # Общая сумма продаж
    total_sales = db.query(
        func.sum(OrderItem.quantity * OrderItem.price_at_time)
    ).join(Order).filter(
        Order.created_at >= start_date,
        Order.status != "cancelled"
    ).scalar() or 0
    
    # Общее количество заказов
    total_orders = db.query(func.count(Order.id)).filter(
        Order.created_at >= start_date,
        Order.status != "cancelled"
    ).scalar() or 0
    
    # Товары с низким запасом
    low_stock_items = db.query(func.count(Product.id)).filter(
        Product.stock <= 10
    ).scalar() or 0
    
    # Последние заказы
    recent_orders = db.query(Order).filter(
        Order.created_at >= start_date,
        Order.status != "cancelled"
    ).order_by(desc(Order.created_at)).limit(5).all()
    
    recent_orders_data = [
        {
            "id": order.id,
            "total_amount": order.total_amount,
            "created_at": order.created_at,
            "status": order.status
        }
        for order in recent_orders
    ]
    
    # Топ продаваемых товаров
    top_products = db.query(
        Product,
        func.sum(OrderItem.quantity).label("total_quantity")
    ).join(OrderItem).join(Order).filter(
        Order.created_at >= start_date,
        Order.status != "cancelled"
    ).group_by(Product.id).order_by(desc("total_quantity")).limit(5).all()
    
    top_products_data = [
        {
            "id": product.id,
            "name": product.name,
            "total_quantity": quantity,
            "price": product.price
        }
        for product, quantity in top_products
    ]
    
    return {
        "total_sales": float(total_sales),
        "total_orders": total_orders,
        "low_stock_items": low_stock_items,
        "recent_orders": recent_orders_data,
        "top_products": top_products_data
    } 