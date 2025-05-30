from fastapi import APIRouter, HTTPException, status, Depends
from typing import List

from src.products.schemas import Product, ProductCreate, ProductUpdate
from src.products.service import ProductService
from src.auth.dependencies import get_current_user
from src.auth.schemas import SUser

router = APIRouter()

@router.get("/products", response_model=List[Product])
async def get_products(current_user: SUser = Depends(get_current_user)):
    products = await ProductService.get_all()
    return products

@router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str, current_user: SUser = Depends(get_current_user)):
    product = await ProductService.get_by_id(product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Продукт не найден"
        )
    return product

@router.post("/products", response_model=Product, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    current_user: SUser = Depends(get_current_user)
):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для создания продуктов"
        )
    
    existing_product = await ProductService.get_by_sku(product_data.sku)
    if existing_product:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Продукт с таким SKU уже существует"
        )
    
    product = await ProductService.create(product_data.model_dump())
    return product

@router.put("/products/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    current_user: SUser = Depends(get_current_user)
):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для обновления продуктов"
        )
    
    product = await ProductService.update(product_id, product_data.model_dump(exclude_unset=True))
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Продукт не найден"
        )
    return product

@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    current_user: SUser = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для удаления продуктов"
        )
    
    success = await ProductService.delete(product_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Продукт не найден"
        ) 