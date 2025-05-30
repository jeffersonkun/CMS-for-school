from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from datetime import datetime

from src.database import get_session
from src.orders.models import Order, OrderItem
from src.products.service import ProductService

class OrderService:
    @staticmethod
    async def get_all() -> List[Order]:
        async with get_session() as session:
            query = select(Order)
            result = await session.execute(query)
            return list(result.scalars().all())

    @staticmethod
    async def get_by_id(order_id: str) -> Optional[Order]:
        async with get_session() as session:
            query = select(Order).where(Order.id == order_id)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    @staticmethod
    async def create(order_data: dict) -> Order:
        async with get_session() as session:
            # Calculate subtotal and total
            subtotal = sum(item["price"] * item["quantity"] for item in order_data["items"])
            total = subtotal - order_data.get("discount", 0) + order_data.get("shipping", 0)

            # Generate order number
            order_number = f"#{str(uuid.uuid4())[:4].upper()}"

            # Create order
            order = Order(
                id=str(uuid.uuid4()),
                number=order_number,
                customer=order_data["customer"],
                subtotal=subtotal,
                discount=order_data.get("discount", 0),
                shipping=order_data.get("shipping", 0),
                total=total,
                status="pending",
                payment_method=order_data["payment_method"]
            )

            # Create order items
            for item_data in order_data["items"]:
                order_item = OrderItem(
                    id=str(uuid.uuid4()),
                    order_id=order.id,
                    product_id=item_data["product_id"],
                    product_name=item_data["product_name"],
                    quantity=item_data["quantity"],
                    price=item_data["price"]
                )
                order.items.append(order_item)

                # Update product stock
                product = await ProductService.get_by_id(item_data["product_id"])
                if product:
                    product.stock -= item_data["quantity"]

            session.add(order)
            await session.commit()
            await session.refresh(order)
            return order

    @staticmethod
    async def update(order_id: str, order_data: dict) -> Optional[Order]:
        async with get_session() as session:
            order = await OrderService.get_by_id(order_id)
            if not order:
                return None

            # Update order fields
            for key, value in order_data.items():
                if value is not None:
                    setattr(order, key, value)

            # Recalculate total if needed
            if any(key in order_data for key in ["discount", "shipping"]):
                order.total = order.subtotal - order.discount + order.shipping

            await session.commit()
            await session.refresh(order)
            return order

    @staticmethod
    async def delete(order_id: str) -> bool:
        async with get_session() as session:
            order = await OrderService.get_by_id(order_id)
            if not order:
                return False

            # Restore product stock
            for item in order.items:
                product = await ProductService.get_by_id(item.product_id)
                if product:
                    product.stock += item.quantity

            await session.delete(order)
            await session.commit()
            return True 