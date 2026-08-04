from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import companies, contacts, follow_ups, communications, products
from app.core.database import engine
from app.models.base import Base
from app.models import buyer, product
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
app.include_router(companies.router, prefix="/api/v1")
app.include_router(contacts.router, prefix="/api/v1")
app.include_router(follow_ups.router, prefix="/api/v1")
app.include_router(communications.router, prefix="/api/v1")
app.include_router(products.router, prefix="/api/v1")

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
