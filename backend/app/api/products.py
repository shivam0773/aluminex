from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.models.product import Product as ProductModel
from app.schemas.product import Product, ProductCreate, ProductUpdate, ProductList

router = APIRouter(prefix="/products", tags=["products"])

@router.post("/", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    existing = db.query(ProductModel).filter(ProductModel.code == product_in.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product code already exists")
        
    db_product = ProductModel(**product_in.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/", response_model=ProductList)
def list_products(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None)
):
    query = db.query(ProductModel)

    if search:
        query = query.filter((ProductModel.name.ilike(f"%{search}%")) | (ProductModel.code.ilike(f"%{search}%")))
    if category:
        query = query.filter(ProductModel.category == category)
    if is_active is not None:
        query = query.filter(ProductModel.is_active == is_active)

    total = query.count()
    items = query.order_by(desc(ProductModel.created_at)).offset((page - 1) * size).limit(size).all()

    return {"items": items, "total": total, "page": page, "size": size}

@router.get("/{product_id}", response_model=Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.patch("/{product_id}", response_model=Product)
def update_product(product_id: int, product_in: ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product_in.code and product_in.code != db_product.code:
        existing = db.query(ProductModel).filter(ProductModel.code == product_in.code).first()
        if existing:
            raise HTTPException(status_code=400, detail="Product code already exists")
    
    update_data = product_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return None
