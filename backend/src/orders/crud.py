from sqlalchemy.orm import Session
from src.orders import models, schemas
from src.products.crud import get_product, update_stock

def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def get_orders(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    user_id: int = None
):
    query = db.query(models.Order)
    if user_id:
        query = query.filter(models.Order.user_id == user_id)
    return query.offset(skip).limit(limit).all()

def create_order(db: Session, order: schemas.OrderCreate, user_id: int):
    # Проверяем наличие товаров и их количество
    total_amount = 0
    order_items = []
    
    for item in order.items:
        product = get_product(db, item.product_id)
        if not product:
            raise ValueError(f"Product {item.product_id} not found")
        if product.stock < item.quantity:
            raise ValueError(f"Insufficient stock for product {item.product_id}")
        
        total_amount += product.price * item.quantity
        order_items.append({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "price_at_time": product.price
        })
    
    # Создаем заказ
    db_order = models.Order(
        user_id=user_id,
        status=order.status,
        total_amount=total_amount
    )
    db.add(db_order)
    db.flush()  # Получаем ID заказа
    
    # Создаем элементы заказа
    for item in order_items:
        db_item = models.OrderItem(
            order_id=db_order.id,
            **item
        )
        db.add(db_item)
        # Уменьшаем количество товара на складе
        update_stock(db, item["product_id"], -item["quantity"])
    
    db.commit()
    db.refresh(db_order)
    return db_order

def update_order(db: Session, order_id: int, order: schemas.OrderUpdate):
    db_order = get_order(db, order_id)
    if not db_order:
        return None
    
    if order.status:
        # Если заказ отменяется, возвращаем товары на склад
        if order.status == models.OrderStatus.CANCELLED and db_order.status != models.OrderStatus.CANCELLED:
            for item in db_order.items:
                update_stock(db, item.product_id, item.quantity)
        
        db_order.status = order.status
    
    db.commit()
    db.refresh(db_order)
    return db_order

def delete_order(db: Session, order_id: int):
    db_order = get_order(db, order_id)
    if not db_order:
        return False
    
    # Возвращаем товары на склад
    for item in db_order.items:
        update_stock(db, item.product_id, item.quantity)
    
    db.delete(db_order)
    db.commit()
    return True 