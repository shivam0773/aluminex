from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_
from datetime import date

from app.core.database import get_db
from app.models.quotation import Quotation as QuotationModel, QuotationItem as QuotationItemModel, QuotationStatus
from app.models.buyer import Company, ContactPerson
from app.models.product import Product
from app.schemas.quotation import Quotation, QuotationCreate, QuotationUpdate, QuotationList
from app.services.pricing import PricingEngine

router = APIRouter(prefix="/quotations", tags=["quotations"])

@router.post("/", response_model=Quotation, status_code=status.HTTP_201_CREATED)
def create_quotation(quotation_in: QuotationCreate, db: Session = Depends(get_db)):
    # 1. Validation: Company exists
    company = db.query(Company).filter(Company.id == quotation_in.company_id).first()
    if not company:
        raise HTTPException(status_code=400, detail="Company not found")

    # 2. Validation: Contact belongs to company
    if quotation_in.contact_person_id:
        contact = db.query(ContactPerson).filter(
            and_(ContactPerson.id == quotation_in.contact_person_id, ContactPerson.company_id == quotation_in.company_id)
        ).first()
        if not contact:
            raise HTTPException(status_code=400, detail="Contact person does not belong to the selected company")

    # 3. Validation: Unique quotation number
    existing = db.query(QuotationModel).filter(QuotationModel.quotation_number == quotation_in.quotation_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Quotation number already exists")

    # 4. Create Quotation record (without items first)
    quotation_data = quotation_in.dict(exclude={'items'})
    db_quotation = QuotationModel(**quotation_data)
    db_quotation.status = QuotationStatus.DRAFT
    db_quotation.version_number = 1
    
    db.add(db_quotation)
    db.flush() # Get ID

    # 5. Create Items and snapshot data
    for item_in in quotation_in.items:
        # Check product if product_id provided
        if item_in.product_id:
            product = db.query(Product).filter(Product.id == item_in.product_id).first()
            if not product:
                raise HTTPException(status_code=400, detail=f"Product ID {item_in.product_id} not found")
        
        db_item = QuotationItemModel(
            quotation_id=db_quotation.id,
            **item_in.dict()
        )
        db.add(db_item)
        db_quotation.items.append(db_item)

    # 6. Calculate Totals
    PricingEngine.calculate_quotation_totals(db_quotation)
    
    db.commit()
    db.refresh(db_quotation)
    return db_quotation

@router.get("/", response_model=QuotationList)
def list_quotations(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    company_id: Optional[int] = Query(None),
    status: Optional[QuotationStatus] = Query(None),
    currency: Optional[str] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None)
):
    query = db.query(QuotationModel)

    if search:
        query = query.filter(QuotationModel.quotation_number.ilike(f"%{search}%"))
    if company_id:
        query = query.filter(QuotationModel.company_id == company_id)
    if status:
        query = query.filter(QuotationModel.status == status)
    if currency:
        query = query.filter(QuotationModel.currency == currency)
    if date_from:
        query = query.filter(QuotationModel.quotation_date >= date_from)
    if date_to:
        query = query.filter(QuotationModel.quotation_date <= date_to)

    total = query.count()
    items = query.order_by(desc(QuotationModel.created_at)).offset((page - 1) * size).limit(size).all()

    return {"items": items, "total": total, "page": page, "size": size}

@router.get("/{quotation_id}", response_model=Quotation)
def get_quotation(quotation_id: int, db: Session = Depends(get_db)):
    quotation = db.query(QuotationModel).filter(QuotationModel.id == quotation_id).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    return quotation

@router.patch("/{quotation_id}", response_model=Quotation)
def update_quotation(quotation_id: int, quotation_in: QuotationUpdate, db: Session = Depends(get_db)):
    db_quotation = db.query(QuotationModel).filter(QuotationModel.id == quotation_id).first()
    if not db_quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    # Validation: Only Draft/Negotiation can be updated (Negotiation not in phase 1, but status guards anyway)
    if db_quotation.status not in [QuotationStatus.DRAFT]:
        raise HTTPException(status_code=400, detail="Only Draft quotations can be updated")

    update_data = quotation_in.dict(exclude_unset=True, exclude={'items'})
    
    # Verify company if changed
    if 'company_id' in update_data:
        company = db.query(Company).filter(Company.id == update_data['company_id']).first()
        if not company:
            raise HTTPException(status_code=400, detail="Company not found")
            
    # Verify contact if changed
    cid = update_data.get('company_id', db_quotation.company_id)
    cp_id = update_data.get('contact_person_id', db_quotation.contact_person_id)
    if cp_id:
        contact = db.query(ContactPerson).filter(
            and_(ContactPerson.id == cp_id, ContactPerson.company_id == cid)
        ).first()
        if not contact:
            raise HTTPException(status_code=400, detail="Contact person does not belong to the selected company")

    for key, value in update_data.items():
        setattr(db_quotation, key, value)

    # Handle items if provided
    if quotation_in.items is not None:
        # Simplest for Phase 1: Replace all items
        # Clear items collection (cascade delete will handle the deletion)
        db_quotation.items.clear()
        
        # Add new items
        for item_in in quotation_in.items:
            db_item = QuotationItemModel(
                quotation_id=db_quotation.id,
                **item_in.dict()
            )
            db_quotation.items.append(db_item)

    # Re-calculate Totals
    PricingEngine.calculate_quotation_totals(db_quotation)
    
    db.commit()
    db.refresh(db_quotation)
    return db_quotation

@router.delete("/{quotation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quotation(quotation_id: int, db: Session = Depends(get_db)):
    db_quotation = db.query(QuotationModel).filter(QuotationModel.id == quotation_id).first()
    if not db_quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    if db_quotation.status != QuotationStatus.DRAFT:
        raise HTTPException(status_code=400, detail="Only Draft quotations can be deleted")
        
    db.delete(db_quotation)
    db.commit()
    return None
