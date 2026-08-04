from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.database import get_db
from app.models.buyer import ContactPerson as ContactModel, Company as CompanyModel
from app.schemas.buyer import (
    ContactPerson, ContactPersonCreate, ContactPersonUpdate, ContactPersonList
)

router = APIRouter(prefix="/contacts", tags=["contacts"])

@router.post("/", response_model=ContactPerson, status_code=status.HTTP_201_CREATED)
def create_contact(contact_in: ContactPersonCreate, db: Session = Depends(get_db)):
    name = contact_in.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Name cannot be empty")
    
    # Check if company exists
    company = db.query(CompanyModel).filter(CompanyModel.id == contact_in.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    contact_in.name = name
    db_contact = ContactModel(**contact_in.dict())
    
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

@router.get("/", response_model=ContactPersonList)
def list_contacts(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None, description="Search by name or email"),
    company_id: Optional[int] = Query(None, description="Filter by Company ID")
):
    query = db.query(ContactModel)

    if company_id:
        query = query.filter(ContactModel.company_id == company_id)

    if search:
        search_filter = or_(
            ContactModel.name.ilike(f"%{search}%"),
            ContactModel.email.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)

    total = query.count()
    # Added deterministic ordering
    items = query.order_by(ContactModel.name).offset((page - 1) * size).limit(size).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size
    }

@router.get("/{contact_id}", response_model=ContactPerson)
def get_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(ContactModel).filter(ContactModel.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact

@router.patch("/{contact_id}", response_model=ContactPerson)
def update_contact(contact_id: int, contact_in: ContactPersonUpdate, db: Session = Depends(get_db)):
    db_contact = db.query(ContactModel).filter(ContactModel.id == contact_id).first()
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    update_data = contact_in.dict(exclude_unset=True)
    
    # Validate company exists if company_id provided
    if 'company_id' in update_data:
        company = db.query(CompanyModel).filter(CompanyModel.id == update_data['company_id']).first()
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

    # Trim name if provided
    if 'name' in update_data:
        name = update_data['name'].strip()
        if not name:
            raise HTTPException(status_code=400, detail="Name cannot be empty")
        update_data['name'] = name

    for key, value in update_data.items():
        setattr(db_contact, key, value)
    
    db.commit()
    db.refresh(db_contact)
    return db_contact

@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    db_contact = db.query(ContactModel).filter(ContactModel.id == contact_id).first()
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(db_contact)
    db.commit()
    return None
