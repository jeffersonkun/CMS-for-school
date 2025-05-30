from fastapi import APIRouter, HTTPException, status, Depends
from typing import List

from src.orders.schemas import Order, OrderCreate, OrderUpdate
from src.orders.service import OrderService
from src.auth.dependencies import get_current_user
from src.auth.schemas import SUser

router = APIRouter()

@router.get("/orders", response_model=List[Order])
async def get_orders(current_user: SUser = Depends(get_current_user)):
    orders = await OrderService.get_all()
    return orders

@router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str, current_user: SUser = Depends(get_current_user)):
    order = await OrderService.get_by_id(order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказ не найден"
        )
    return order

@router.post("/orders", response_model=Order, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    current_user: SUser = Depends(get_current_user)
):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для создания заказов"
        )
    
    order = await OrderService.create(order_data.model_dump())
    return order

@router.put("/orders/{order_id}", response_model=Order)
async def update_order(
    order_id: str,
    order_data: OrderUpdate,
    current_user: SUser = Depends(get_current_user)
):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для обновления заказов"
        )
    
    order = await OrderService.update(order_id, order_data.model_dump(exclude_unset=True))
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказ не найден"
        )
    return order

@router.delete("/orders/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(
    order_id: str,
    current_user: SUser = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для удаления заказов"
        )
    
    success = await OrderService.delete(order_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказ не найден"
        ) 