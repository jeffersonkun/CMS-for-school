from sqlalchemy.orm import Session
from sqlalchemy import func
from src.reports import models, schemas
from src.orders.models import Order, OrderItem
from src.products.models import Product
from datetime import datetime

def get_report(db: Session, report_id: int):
    return db.query(models.Report).filter(models.Report.id == report_id).first()

def get_reports(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    user_id: int = None
):
    query = db.query(models.Report)
    if user_id:
        query = query.filter(models.Report.user_id == user_id)
    return query.offset(skip).limit(limit).all()

def create_report(db: Session, report: schemas.ReportCreate, user_id: int):
    # Генерируем отчет в зависимости от типа
    result = generate_report(db, report.report_type, report.parameters)
    
    db_report = models.Report(
        user_id=user_id,
        report_type=report.report_type,
        parameters=report.parameters,
        result=result
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

def generate_report(db: Session, report_type: str, parameters: dict):
    if report_type == "sales":
        return generate_sales_report(db, parameters)
    elif report_type == "inventory":
        return generate_inventory_report(db, parameters)
    else:
        raise ValueError(f"Unknown report type: {report_type}")

def generate_sales_report(db: Session, parameters: dict):
    start_date = parameters.get("start_date")
    end_date = parameters.get("end_date")
    category = parameters.get("category")
    
    query = db.query(
        func.sum(OrderItem.quantity * OrderItem.price_at_time).label("total_sales"),
        func.count(Order.id).label("total_orders"),
        func.avg(OrderItem.price_at_time).label("average_price")
    ).join(Order).join(Product)
    
    if start_date:
        query = query.filter(Order.created_at >= start_date)
    if end_date:
        query = query.filter(Order.created_at <= end_date)
    if category:
        query = query.filter(Product.category == category)
    
    result = query.first()
    
    return {
        "total_sales": float(result.total_sales or 0),
        "total_orders": result.total_orders or 0,
        "average_price": float(result.average_price or 0)
    }

def generate_inventory_report(db: Session, parameters: dict):
    low_stock_threshold = parameters.get("low_stock_threshold", 10)
    category = parameters.get("category")
    
    query = db.query(Product)
    if category:
        query = query.filter(Product.category == category)
    
    products = query.all()
    
    low_stock_products = [
        {
            "id": p.id,
            "name": p.name,
            "stock": p.stock,
            "category": p.category
        }
        for p in products
        if p.stock <= low_stock_threshold
    ]
    
    return {
        "total_products": len(products),
        "low_stock_products": low_stock_products,
        "low_stock_threshold": low_stock_threshold
    } 