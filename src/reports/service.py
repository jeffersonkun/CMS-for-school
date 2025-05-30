from typing import Dict, List
from datetime import datetime, timedelta
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_session
from src.orders.models import Order, OrderItem
from src.products.models import Product

class ReportService:
    @staticmethod
    async def get_sales_report(start_date: datetime, end_date: datetime) -> Dict:
        async with get_session() as session:
            # Get orders within date range
            query = select(Order).where(
                and_(
                    Order.created_at >= start_date,
                    Order.created_at <= end_date
                )
            )
            result = await session.execute(query)
            orders = list(result.scalars().all())

            # Calculate metrics
            total_sales = sum(order.total for order in orders)
            total_orders = len(orders)
            avg_order = total_sales / total_orders if total_orders > 0 else 0

            # Get daily sales
            daily_sales = {}
            for order in orders:
                date = order.created_at.date()
                if date not in daily_sales:
                    daily_sales[date] = {"sales": 0, "orders": 0}
                daily_sales[date]["sales"] += order.total
                daily_sales[date]["orders"] += 1

            # Format data for response
            chart_data = {
                "labels": [],
                "values": []
            }
            table_data = []

            current_date = start_date
            while current_date <= end_date:
                date_str = current_date.strftime("%d.%m.%Y")
                sales = daily_sales.get(current_date.date(), {"sales": 0, "orders": 0})
                
                chart_data["labels"].append(date_str)
                chart_data["values"].append(sales["sales"])
                
                table_data.append({
                    "id": str(len(table_data) + 1),
                    "date": date_str,
                    "orders": sales["orders"],
                    "sales": f"₽{sales['sales']:,.0f}",
                    "average": f"₽{sales['sales'] / sales['orders']:,.0f}" if sales["orders"] > 0 else "₽0"
                })
                
                current_date += timedelta(days=1)

            return {
                "chartData": chart_data,
                "metrics": [
                    {
                        "id": "1",
                        "title": "Общие продажи",
                        "value": f"₽{total_sales:,.0f}",
                        "change": {
                            "value": "12%",
                            "isPositive": True
                        }
                    },
                    {
                        "id": "2",
                        "title": "Средний чек",
                        "value": f"₽{avg_order:,.0f}",
                        "change": {
                            "value": "3%",
                            "isPositive": False
                        }
                    },
                    {
                        "id": "3",
                        "title": "Количество заказов",
                        "value": str(total_orders),
                        "change": {
                            "value": "8%",
                            "isPositive": True
                        }
                    },
                    {
                        "id": "4",
                        "title": "Возвраты",
                        "value": "₽3,200",
                        "change": {
                            "value": "5%",
                            "isPositive": False
                        }
                    }
                ],
                "tableData": table_data
            }

    @staticmethod
    async def get_products_report(start_date: datetime, end_date: datetime) -> Dict:
        async with get_session() as session:
            # Get order items within date range
            query = select(OrderItem).join(Order).where(
                and_(
                    Order.created_at >= start_date,
                    Order.created_at <= end_date
                )
            )
            result = await session.execute(query)
            order_items = list(result.scalars().all())

            # Calculate product metrics
            product_metrics = {}
            for item in order_items:
                if item.product_id not in product_metrics:
                    product_metrics[item.product_id] = {
                        "name": item.product_name,
                        "sold": 0,
                        "revenue": 0
                    }
                product_metrics[item.product_id]["sold"] += item.quantity
                product_metrics[item.product_id]["revenue"] += item.price * item.quantity

            # Get product stock
            for product_id in product_metrics:
                query = select(Product).where(Product.id == product_id)
                result = await session.execute(query)
                product = result.scalar_one_or_none()
                if product:
                    product_metrics[product_id]["stock"] = product.stock

            # Format data for response
            chart_data = {
                "labels": [],
                "values": []
            }
            table_data = []

            for product_id, metrics in product_metrics.items():
                chart_data["labels"].append(metrics["name"])
                chart_data["values"].append(metrics["sold"])
                
                table_data.append({
                    "id": product_id,
                    "name": metrics["name"],
                    "sold": metrics["sold"],
                    "revenue": f"₽{metrics['revenue']:,.0f}",
                    "stock": metrics.get("stock", 0)
                })

            total_sold = sum(metrics["sold"] for metrics in product_metrics.values())
            total_revenue = sum(metrics["revenue"] for metrics in product_metrics.values())
            avg_price = total_revenue / total_sold if total_sold > 0 else 0

            return {
                "chartData": chart_data,
                "metrics": [
                    {
                        "id": "1",
                        "title": "Всего продано",
                        "value": str(total_sold),
                        "change": {
                            "value": "15%",
                            "isPositive": True
                        }
                    },
                    {
                        "id": "2",
                        "title": "Самый популярный",
                        "value": max(product_metrics.items(), key=lambda x: x[1]["sold"])[1]["name"],
                        "change": {
                            "value": f"{max(product_metrics.items(), key=lambda x: x[1]['sold'])[1]['sold']} шт.",
                            "isPositive": True
                        }
                    },
                    {
                        "id": "3",
                        "title": "Средняя цена",
                        "value": f"₽{avg_price:,.0f}",
                        "change": {
                            "value": "2%",
                            "isPositive": True
                        }
                    },
                    {
                        "id": "4",
                        "title": "Возвраты",
                        "value": "5",
                        "change": {
                            "value": "1%",
                            "isPositive": False
                        }
                    }
                ],
                "tableData": table_data
            }

    @staticmethod
    async def get_customers_report(start_date: datetime, end_date: datetime) -> Dict:
        async with get_session() as session:
            # Get orders within date range
            query = select(Order).where(
                and_(
                    Order.created_at >= start_date,
                    Order.created_at <= end_date
                )
            )
            result = await session.execute(query)
            orders = list(result.scalars().all())

            # Calculate customer metrics
            customer_metrics = {}
            for order in orders:
                customer_id = order.customer["id"]
                if customer_id not in customer_metrics:
                    customer_metrics[customer_id] = {
                        "name": order.customer["name"],
                        "orders": 0,
                        "spent": 0,
                        "last_order": order.created_at
                    }
                customer_metrics[customer_id]["orders"] += 1
                customer_metrics[customer_id]["spent"] += order.total
                if order.created_at > customer_metrics[customer_id]["last_order"]:
                    customer_metrics[customer_id]["last_order"] = order.created_at

            # Format data for response
            chart_data = {
                "labels": ["Новые", "Повторные", "Постоянные"],
                "values": [24, 38, 18]  # Mock data
            }
            table_data = []

            for customer_id, metrics in customer_metrics.items():
                table_data.append({
                    "id": customer_id,
                    "name": metrics["name"],
                    "orders": metrics["orders"],
                    "spent": f"₽{metrics['spent']:,.0f}",
                    "lastOrder": metrics["last_order"].strftime("%d.%m.%Y")
                })

            total_customers = len(customer_metrics)
            total_spent = sum(metrics["spent"] for metrics in customer_metrics.values())
            avg_spent = total_spent / total_customers if total_customers > 0 else 0

            return {
                "chartData": chart_data,
                "metrics": [
                    {
                        "id": "1",
                        "title": "Всего клиентов",
                        "value": str(total_customers),
                        "change": {
                            "value": "12%",
                            "isPositive": True
                        }
                    },
                    {
                        "id": "2",
                        "title": "Новые клиенты",
                        "value": "24",
                        "change": {
                            "value": "8%",
                            "isPositive": True
                        }
                    },
                    {
                        "id": "3",
                        "title": "Средний чек",
                        "value": f"₽{avg_spent:,.0f}",
                        "change": {
                            "value": "3%",
                            "isPositive": False
                        }
                    },
                    {
                        "id": "4",
                        "title": "Конверсия",
                        "value": "5.2%",
                        "change": {
                            "value": "0.3%",
                            "isPositive": True
                        }
                    }
                ],
                "tableData": table_data
            } 