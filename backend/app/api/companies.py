from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app.core.database import get_db
from app.models.buyer import (
    Company as CompanyModel,
    Address as AddressModel,
    ContactPerson as ContactModel,
    ProductInterest as ProductModel,
    Note as NoteModel,
    FollowUp as FollowModel,
    CommunicationHistory as CommModel,
    CompanyStatus,
    ProductType
)
from app.schemas.buyer import (
    Company, CompanyCreate, CompanyUpdate, CompanyList,
    ContactPerson, ContactPersonCreate, ContactPersonUpdate,
    Note, NoteCreate,
    FollowUp, FollowUpCreate, FollowUpUpdate,
    CommunicationHistory, CommunicationHistoryCreate
)

router = APIRouter(prefix="/companies", tags=["companies"])

# --- Company Endpoints ---

@router.post("/", response_model=Company, status_code=status.HTTP_201_CREATED)
def create_company(company_in: CompanyCreate, db: Session = Depends(get_db)):
    db_company = CompanyModel(**company_in.dict(exclude={"addresses", "product_interests"}))
    db.add(db_company)
    db.flush()  # To get the ID

    for addr in company_in.addresses:
        db.add(AddressModel(company_id=db_company.id, **addr.dict()))
    
    for prod in company_in.product_interests:
        db.add(ProductModel(company_id=db_company.id, product=prod))
    
    db.commit()
    db.refresh(db_company)
    return db_company

@router.get("/", response_model=CompanyList)
def list_companies(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None, description="Search by name, city, state"),
    status: Optional[CompanyStatus] = None,
    product: Optional[ProductType] = None,
    lead_source: Optional[str] = None
):
    query = db.query(CompanyModel)

    # Search Logic
    if search:
        search_filter = or_(
            CompanyModel.name.ilike(f"%{search}%"),
            CompanyModel.addresses.any(AddressModel.city.ilike(f"%{search}%")),
            CompanyModel.addresses.any(AddressModel.state.ilike(f"%{search}%"))
        )
        query = query.filter(search_filter)

    # Filters
    if status:
        query = query.filter(CompanyModel.status == status)
    if product:
        query = query.filter(CompanyModel.product_interests.any(ProductModel.product == product))
    if lead_source:
        query = query.filter(CompanyModel.lead_source == lead_source)

    total = query.count()
    items = query.offset((page - 1) * size).limit(size).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size
    }

@router.get("/{company_id}", response_model=Company)
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@router.patch("/{company_id}", response_model=Company)
def update_company(company_id: int, company_in: CompanyUpdate, db: Session = Depends(get_db)):
    db_company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not db_company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    update_data = company_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_company, key, value)
    
    db.commit()
    db.refresh(db_company)
    return db_company

@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_company(company_id: int, db: Session = Depends(get_db)):
    db_company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not db_company:
        raise HTTPException(status_code=404, detail="Company not found")
    db.delete(db_company)
    db.commit()
    return None

# --- Contact Person Endpoints ---

@router.post("/{company_id}/contacts", response_model=ContactPerson)
def create_contact(company_id: int, contact_in: ContactPersonCreate, db: Session = Depends(get_db)):
    db_contact = ContactModel(**contact_in.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

# --- Notes Endpoints ---

@router.post("/{company_id}/notes", response_model=Note)
def create_note(company_id: int, note_in: NoteCreate, db: Session = Depends(get_db)):
    db_note = NoteModel(**note_in.dict())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

# --- Follow-Up Endpoints ---

@router.post("/{company_id}/follow-ups", response_model=FollowUp)
def create_follow_up(company_id: int, follow_in: FollowUpCreate, db: Session = Depends(get_db)):
    db_follow = FollowModel(**follow_in.dict())
    db.add(db_follow)
    db.commit()
    db.refresh(db_follow)
    return db_follow

@router.patch("/follow-ups/{follow_up_id}", response_model=FollowUp)
def update_follow_up(follow_up_id: int, follow_in: FollowUpUpdate, db: Session = Depends(get_db)):
    db_follow = db.query(FollowModel).filter(FollowModel.id == follow_up_id).first()
    if not db_follow:
        raise HTTPException(status_code=404, detail="Follow-up not found")
    
    update_data = follow_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_follow, key, value)
    
    db.commit()
    db.refresh(db_follow)
    return db_follow

# --- Communication History Endpoints ---

@router.post("/{company_id}/communications", response_model=CommunicationHistory)
def create_communication(company_id: int, comm_in: CommunicationHistoryCreate, db: Session = Depends(get_db)):
    db_comm = CommModel(**comm_in.dict())
    db.add(db_comm)
    db.commit()
    db.refresh(db_comm)
    return db_comm
