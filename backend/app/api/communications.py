from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime

from app.core.database import get_db
from app.models.buyer import CommunicationHistory as CommModel, CommunicationChannel, Company as CompanyModel, ContactPerson as ContactModel
from app.schemas.buyer import CommunicationHistory, CommunicationHistoryCreate, CommunicationHistoryUpdate, CommunicationHistoryList

router = APIRouter(prefix="/communications", tags=["communications"])

def get_company_or_404(company_id: int, db: Session):
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

def get_contact_or_404(contact_id: int, db: Session):
    contact = db.query(ContactModel).filter(ContactModel.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact person not found")
    return contact

@router.post("/", response_model=CommunicationHistory, status_code=status.HTTP_201_CREATED)
def create_communication(comm_in: CommunicationHistoryCreate, db: Session = Depends(get_db)):
    get_company_or_404(comm_in.company_id, db)
    if comm_in.contact_person_id:
        get_contact_or_404(comm_in.contact_person_id, db)
        
    db_comm = CommModel(**comm_in.dict())
    db.add(db_comm)
    db.commit()
    db.refresh(db_comm)
    return db_comm

@router.get("/", response_model=CommunicationHistoryList)
def list_communications(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None, description="Search by summary"),
    company_id: Optional[int] = None,
    channel: Optional[CommunicationChannel] = None,
    contact_person_id: Optional[int] = None,
    date_after: Optional[datetime] = None,
    date_before: Optional[datetime] = None
):
    query = db.query(CommModel)

    if search:
        query = query.filter(CommModel.summary.ilike(f"%{search}%"))
    if company_id:
        query = query.filter(CommModel.company_id == company_id)
    if channel:
        query = query.filter(CommModel.channel == channel)
    if contact_person_id:
        query = query.filter(CommModel.contact_person_id == contact_person_id)
    if date_after:
        query = query.filter(CommModel.date >= date_after)
    if date_before:
        query = query.filter(CommModel.date <= date_before)

    total = query.count()
    items = query.order_by(desc(CommModel.date)).offset((page - 1) * size).limit(size).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size
    }

@router.get("/{comm_id}", response_model=CommunicationHistory)
def get_communication(comm_id: int, db: Session = Depends(get_db)):
    comm = db.query(CommModel).filter(CommModel.id == comm_id).first()
    if not comm:
        raise HTTPException(status_code=404, detail="Communication not found")
    return comm

@router.patch("/{comm_id}", response_model=CommunicationHistory)
def update_communication(comm_id: int, comm_in: CommunicationHistoryUpdate, db: Session = Depends(get_db)):
    db_comm = db.query(CommModel).filter(CommModel.id == comm_id).first()
    if not db_comm:
        raise HTTPException(status_code=404, detail="Communication not found")
    
    if comm_in.company_id:
        get_company_or_404(comm_in.company_id, db)
    if comm_in.contact_person_id:
        get_contact_or_404(comm_in.contact_person_id, db)
    
    update_data = comm_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_comm, key, value)
    
    db.commit()
    db.refresh(db_comm)
    return db_comm

@router.delete("/{comm_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_communication(comm_id: int, db: Session = Depends(get_db)):
    db_comm = db.query(CommModel).filter(CommModel.id == comm_id).first()
    if not db_comm:
        raise HTTPException(status_code=404, detail="Communication not found")
    db.delete(db_comm)
    db.commit()
    return None
