from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from src.auth.router import router as router_auth
from src.application.router import router as router_application
from src.event.router import router as router_event
from src.conference.router import router as router_conference
from src.users.router import router as router_users
from src.products.router import router as router_products
from src.orders.router import router as router_orders
from src.reports.router import router as router_reports
from src.dashboard.router import router as router_dashboard

app = FastAPI(
    title="API Documentation",
    description="API documentation for the service",
    version="1.0.0",
    root_path="/api",
    docs_url="/docs"
)

# Настройка CORS
origins = [
    "http://localhost",
    "http://localhost:3000",  # Для React/Next.js frontend
    "http://localhost:8000",  # Для локальной разработки
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Set-Cookie", "Access-Control-Allow-Headers",
                  "Access-Control-Allow-Origin", "Authorization"],
)

# Обработка статических файлов
app.mount("/static", StaticFiles(directory="static"), name="static")

# Подключение роутеров

app.include_router(router_auth, prefix="/v1/auth", tags=["auth"])
app.include_router(router_users, prefix="/v1/users", tags=["users"])
app.include_router(router_products, prefix="/v1/products", tags=["products"])
app.include_router(router_orders, prefix="/v1/orders", tags=["orders"])
app.include_router(router_reports, prefix="/v1/reports", tags=["reports"])
app.include_router(router_dashboard, prefix="/v1/dashboard", tags=["dashboard"])
app.include_router(router_application, prefix="/v1/application", tags=["application"])
app.include_router(router_event, prefix="/v1", tags=["events"])
app.include_router(router_conference, prefix="/v1", tags=["conference"])

# Обработчик ошибок
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"}
    )
