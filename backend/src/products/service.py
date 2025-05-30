from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from src.database import get_session
from src.products.models import Product

class ProductService:
    @staticmethod
    async def get_all() -> List[Product]:
        async with get_session() as session:
            query = select(Product)
            result = await session.execute(query)
            return list(result.scalars().all())

    @staticmethod
    async def get_by_id(product_id: str) -> Optional[Product]:
        async with get_session() as session:
            query = select(Product).where(Product.id == product_id)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    @staticmethod
    async def get_by_sku(sku: str) -> Optional[Product]:
        async with get_session() as session:
            query = select(Product).where(Product.sku == sku)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    @staticmethod
    async def create(product_data: dict) -> Product:
        async with get_session() as session:
            product = Product(
                id=str(uuid.uuid4()),
                **product_data
            )
            session.add(product)
            await session.commit()
            await session.refresh(product)
            return product

    @staticmethod
    async def update(product_id: str, product_data: dict) -> Optional[Product]:
        async with get_session() as session:
            product = await ProductService.get_by_id(product_id)
            if not product:
                return None

            for key, value in product_data.items():
                if value is not None:
                    setattr(product, key, value)

            await session.commit()
            await session.refresh(product)
            return product

    @staticmethod
    async def delete(product_id: str) -> bool:
        async with get_session() as session:
            product = await ProductService.get_by_id(product_id)
            if not product:
                return False

            await session.delete(product)
            await session.commit()
            return True 