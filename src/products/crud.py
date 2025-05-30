from sqlalchemy.orm import Session
from src.products import models, schemas

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    category: str = None
):
    query = db.query(models.Product)
    if category:
        query = query.filter(models.Product.category == category)
    return query.offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate, user_id: int):
    db_product = models.Product(
        **product.model_dump(),
        created_by=user_id
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: schemas.ProductUpdate):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    update_data = product.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if not db_product:
        return False
    db.delete(db_product)
    db.commit()
    return True

def update_stock(db: Session, product_id: int, quantity: int):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    db_product.stock += quantity
    if db_product.stock < 0:
        return None
    
    db.commit()
    db.refresh(db_product)
    return db_product 