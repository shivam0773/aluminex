from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import date

from app.core.database import get_db
from app.models.sales_order import SalesOrder as SalesOrderModel, SalesOrderItem as SalesOrderItemModel, SalesOrderStatus
from app.models.buyer import Company
from app.models.quotation import Quotation as QuotationModel, QuotationStatus
from app.schemas.sales_order import SalesOrder, SalesOrderCreate, SalesOrderUpdate, SalesOrderPaginated
from app.services.pricing import PricingEngine

router = APIRouter(prefix="/sales-orders", tags=["sales-orders"])

@router.post("/", response_model=SalesOrder, status_code=status.HTTP_201_CREATED)
def create_sales_order(sales_order_in: SalesOrderCreate, db: Session = Depends(get_db)):
    # 1. Validation: Company exists
    company = db.query(Company).filter(Company.id == sales_order_in.company_id).first()
    if not company:
        raise HTTPException(status_code=400, detail="Company not found")

    # 2. Validation: Unique order number
    existing = db.query(SalesOrderModel).filter(SalesOrderModel.order_number == sales_order_in.order_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Order number already exists")

    # 3. Create Sales Order record
    sales_order_data = sales_order_in.dict(exclude={'items'})
    db_sales_order = SalesOrderModel(**sales_order_data)
    db_sales_order.status = SalesOrderStatus.DRAFT
    
    db.add(db_sales_order)
    db.flush() 

    # 4. Create Items
    for item_in in sales_order_in.items:
        db_item = SalesOrderItemModel(
            sales_order_id=db_sales_order.id,
            **item_in.dict()
        )
        db.add(db_item)
        db_sales_order.items.append(db_item)

    # 5. Calculate Totals
    PricingEngine.calculate_sales_order_totals(db_sales_order)

    db.commit()
    db.refresh(db_sales_order)
    return db_sales_order

@router.post("/from-quotation/{quotation_id}", response_model=SalesOrder, status_code=status.HTTP_201_CREATED)
def create_sales_order_from_quotation(quotation_id: int, order_number: str, db: Session = Depends(get_db)):
    # 1. Fetch Quotation
    quotation = db.query(QuotationModel).filter(QuotationModel.id == quotation_id).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    # 2. Check if already converted
    existing = db.query(SalesOrderModel).filter(SalesOrderModel.quotation_id == quotation_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Sales order already created from this quotation")

    # 3. Create Sales Order
    db_sales_order = SalesOrderModel(
        order_number=order_number,
        quotation_id=quotation.id,
        company_id=quotation.company_id,
        contact_person_id=quotation.contact_person_id,
        order_date=date.today(),
        currency=quotation.currency,
        freight=quotation.freight,
        status=SalesOrderStatus.DRAFT
    )
    
    db.add(db_sales_order)
    db.flush()

    # 4. Copy Items
    for item in quotation.items:
        db_item = SalesOrderItemModel(
            sales_order_id=db_sales_order.id,
            product_id=item.product_id,
            product_code_snapshot=item.product_code,
            product_name_snapshot=item.product_name,
            description_snapshot=item.description,
            quantity=item.quantity,
            unit=item.unit,
            unit_price=item.unit_price,
            tax_rate=item.tax_rate_pct,
            line_total=item.line_total
        )
        db.add(db_item)
        db_sales_order.items.append(db_item)
    
    # 5. Calculate Totals
    PricingEngine.calculate_sales_order_totals(db_sales_order)

    db.commit()
    db.refresh(db_sales_order)
    return db_sales_order

@router.get("/", response_model=SalesOrderPaginated)
def list_sales_orders(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    company_id: Optional[int] = Query(None),
    status: Optional[SalesOrderStatus] = Query(None)
):
    query = db.query(SalesOrderModel)

    if search:
        query = query.filter(SalesOrderModel.order_number.ilike(f"%{search}%"))
    if company_id:
        query = query.filter(SalesOrderModel.company_id == company_id)
    if status:
        query = query.filter(SalesOrderModel.status == status)

    total = query.count()
    items = query.order_by(desc(SalesOrderModel.created_at)).offset((page - 1) * size).limit(size).all()

    return {"items": items, "total": total, "page": page, "size": size}

@router.get("/{order_id}", response_model=SalesOrder)
def get_sales_order(order_id: int, db: Session = Depends(get_db)):
    sales_order = db.query(SalesOrderModel).filter(SalesOrderModel.id == order_id).first()
    if not sales_order:
        raise HTTPException(status_code=404, detail="Sales order not found")
    return sales_order

@router.patch("/{order_id}", response_model=SalesOrder)
def update_sales_order(order_id: int, sales_order_in: SalesOrderUpdate, db: Session = Depends(get_db)):
    db_sales_order = db.query(SalesOrderModel).filter(SalesOrderModel.id == order_id).first()
    if not db_sales_order:
        raise HTTPException(status_code=404, detail="Sales order not found")
    
    if db_sales_order.status != SalesOrderStatus.DRAFT:
        raise HTTPException(status_code=400, detail="Only Draft sales orders can be updated")

    update_data = sales_order_in.dict(exclude_unset=True, exclude={'items'})
    
    for key, value in update_data.items():
        setattr(db_sales_order, key, value)

    if sales_order_in.items is not None:
        db_sales_order.items.clear()
        for item_in in sales_order_in.items:
            db_item = SalesOrderItemModel(
                sales_order_id=db_sales_order.id,
                **item_in.dict()
            )
            db_sales_order.items.append(db_item)
    
    # Calculate Totals
    PricingEngine.calculate_sales_order_totals(db_sales_order)

    db.commit()
    db.refresh(db_sales_order)
    return db_sales_order

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sales_order(order_id: int, db: Session = Depends(get_db)):
    db_sales_order = db.query(SalesOrderModel).filter(SalesOrderModel.id == order_id).first()
    if not db_sales_order:
        raise HTTPException(status_code=404, detail="Sales order not found")
    
    if db_sales_order.status != SalesOrderStatus.DRAFT:
        raise HTTPException(status_code=400, detail="Only Draft sales orders can be deleted")
        
    db.delete(db_sales_order)
    db.commit()
    return None
