from typing import Dict
from datetime import datetime, timedelta
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_session
from src.orders.models import Order, OrderItem
from src.products.models import Product

class DashboardService:
    @staticmethod
    async def get_dashboard_data() -> Dict:
        async with get_session() as session:
            # Получаем данные за сегодня
            today = datetime.utcnow().date()
            today_start = datetime.combine(today, datetime.min.time())
            today_end = datetime.combine(today, datetime.max.time())

            # Получаем заказы за сегодня
            today_orders_query = select(Order).where(
                and_(
                    Order.created_at >= today_start,
                    Order.created_at <= today_end
                )
            )
            today_orders_result = await session.execute(today_orders_query)
            today_orders = list(today_orders_result.scalars().all())

            # Получаем заказы за вчера для сравнения
            yesterday = today - timedelta(days=1)
            yesterday_start = datetime.combine(yesterday, datetime.min.time())
            yesterday_end = datetime.combine(yesterday, datetime.max.time())
            yesterday_orders_query = select(Order).where(
                and_(
                    Order.created_at >= yesterday_start,
                    Order.created_at <= yesterday_end
                )
            )
            yesterday_orders_result = await session.execute(yesterday_orders_query)
            yesterday_orders = list(yesterday_orders_result.scalars().all())

            # Рассчитываем метрики
            today_sales = sum(order.total for order in today_orders)
            yesterday_sales = sum(order.total for order in yesterday_orders)
            sales_change = ((today_sales - yesterday_sales) / yesterday_sales * 100) if yesterday_sales > 0 else 0

            today_orders_count = len(today_orders)
            yesterday_orders_count = len(yesterday_orders)
            orders_change = ((today_orders_count - yesterday_orders_count) / yesterday_orders_count * 100) if yesterday_orders_count > 0 else 0

            avg_order = today_sales / today_orders_count if today_orders_count > 0 else 0
            yesterday_avg_order = yesterday_sales / yesterday_orders_count if yesterday_orders_count > 0 else 0
            avg_order_change = ((avg_order - yesterday_avg_order) / yesterday_avg_order * 100) if yesterday_avg_order > 0 else 0

            # Получаем активных клиентов (сделавших заказ за последние 30 дней)
            thirty_days_ago = today - timedelta(days=30)
            active_customers_query = select(func.count(func.distinct(Order.customer["id"]))).where(
                Order.created_at >= thirty_days_ago
            )
            active_customers_result = await session.execute(active_customers_query)
            active_customers = active_customers_result.scalar_one() or 0

            # Получаем данные для графика продаж за неделю
            week_ago = today - timedelta(days=7)
            sales_by_day = {}
            current_date = week_ago
            while current_date <= today:
                sales_by_day[current_date] = 0
                current_date += timedelta(days=1)

            weekly_orders_query = select(Order).where(
                and_(
                    Order.created_at >= week_ago,
                    Order.created_at <= today_end
                )
            )
            weekly_orders_result = await session.execute(weekly_orders_query)
            weekly_orders = list(weekly_orders_result.scalars().all())

            for order in weekly_orders:
                date = order.created_at.date()
                sales_by_day[date] += order.total

            # Получаем топ продуктов
            top_products_query = select(
                Product.id,
                Product.name,
                func.sum(OrderItem.quantity).label("sales"),
                func.sum(OrderItem.quantity * OrderItem.price).label("amount")
            ).join(OrderItem).join(Order).where(
                Order.created_at >= today_start
            ).group_by(Product.id, Product.name).order_by(
                func.sum(OrderItem.quantity).desc()
            ).limit(5)

            top_products_result = await session.execute(top_products_query)
            top_products = [
                {
                    "id": str(row.id),
                    "name": row.name,
                    "sales": row.sales,
                    "amount": f"₽{row.amount:,.0f}"
                }
                for row in top_products_result
            ]

            # Получаем последние заказы
            recent_orders_query = select(Order).order_by(Order.created_at.desc()).limit(5)
            recent_orders_result = await session.execute(recent_orders_query)
            recent_orders = [
                {
                    "id": str(order.id),
                    "number": order.number,
                    "customer": order.customer["name"],
                    "total": f"₽{order.total:,.0f}",
                    "status": order.status,
                    "date": order.created_at.strftime("%d.%m.%Y")
                }
                for order in recent_orders_result.scalars().all()
            ]

            # Получаем товары с низким остатком
            low_stock_products_query = select(Product).where(
                Product.stock <= Product.min_stock
            ).order_by(Product.stock.asc()).limit(4)
            low_stock_products_result = await session.execute(low_stock_products_query)
            low_stock_products = [
                {
                    "id": str(product.id),
                    "name": product.name,
                    "stock": product.stock,
                    "threshold": product.min_stock
                }
                for product in low_stock_products_result.scalars().all()
            ]

            return {
                "todaySales": {
                    "value": f"₽{today_sales:,.0f}",
                    "change": {
                        "value": f"{sales_change:,.0f}%",
                        "isPositive": sales_change >= 0
                    }
                },
                "todayOrders": {
                    "value": str(today_orders_count),
                    "change": {
                        "value": f"{orders_change:,.0f}%",
                        "isPositive": orders_change >= 0
                    }
                },
                "averageOrder": {
                    "value": f"₽{avg_order:,.0f}",
                    "change": {
                        "value": f"{avg_order_change:,.0f}%",
                        "isPositive": avg_order_change >= 0
                    }
                },
                "activeCustomers": {
                    "value": str(active_customers),
                    "change": {
                        "value": "24%",
                        "isPositive": True
                    }
                },
                "salesChart": {
                    "labels": [date.strftime("%a") for date in sales_by_day.keys()],
                    "values": list(sales_by_day.values())
                },
                "topProducts": top_products,
                "recentOrders": recent_orders,
                "lowStockProducts": low_stock_products
            } 