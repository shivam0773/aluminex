from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import (
    companies as companies_api,
    contacts as contacts_api,
    follow_ups as follow_ups_api,
    communications as communications_api,
    products as products_api,
    quotations as quotations_api,
    sales_orders as sales_orders_api,
    inventory as inventory_api,
    shipments as shipments_api,
    invoices as invoices_api,
    payments as payments_api
)
from app.core.database import engine
from app.models.base import Base
from app.models import (
    buyer as buyer_model,
    product as product_model,
    quotation as quotation_model,
    sales_order as sales_order_model,
    inventory as inventory_model,
    shipment as shipment_model,
    invoice as invoice_model,
    payment as payment_model
)

Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="ALUMINEX API",
    description="The AI-powered operating system for the global aluminium trading industry.",
    version="0.1"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(companies_api.router, prefix="/api/v1")
app.include_router(contacts_api.router, prefix="/api/v1")
app.include_router(follow_ups_api.router, prefix="/api/v1")
app.include_router(communications_api.router, prefix="/api/v1")
app.include_router(products_api.router, prefix="/api/v1")
app.include_router(quotations_api.router, prefix="/api/v1")
app.include_router(sales_orders_api.router, prefix="/api/v1")
app.include_router(inventory_api.router, prefix="/api/v1")
app.include_router(shipments_api.router, prefix="/api/v1")
app.include_router(invoices_api.router, prefix="/api/v1")
app.include_router(payments_api.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "project": "ALUMINEX",
        "status": "running",
        "version": "0.1"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
