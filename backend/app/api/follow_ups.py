from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from datetime import datetime

from app.core.database import get_db
from app.models.buyer import FollowUp as FollowModel, FollowUpStatus, Company as CompanyModel
from app.schemas.buyer import FollowUp, FollowUpCreate, FollowUpUpdate, FollowUpList

router = APIRouter(prefix="/follow-ups", tags=["follow-ups"])

def get_company_or_404(company_id: int, db: Session):
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@router.post("/", response_model=FollowUp, status_code=status.HTTP_201_CREATED)
def create_follow_up(follow_in: FollowUpCreate, db: Session = Depends(get_db)):
    get_company_or_404(follow_in.company_id, db)
    db_follow = FollowModel(**follow_in.dict())
    db.add(db_follow)
    db.commit()
    db.refresh(db_follow)
    return db_follow

@router.get("/", response_model=FollowUpList)
def list_follow_ups(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None, description="Search by task description"),
    company_id: Optional[int] = None,
    status: Optional[FollowUpStatus] = None,
    scheduled_after: Optional[datetime] = None,
    scheduled_before: Optional[datetime] = None
):
    query = db.query(FollowModel)

    if search:
        query = query.filter(FollowModel.task_description.ilike(f"%{search}%"))
    if company_id:
        query = query.filter(FollowModel.company_id == company_id)
    if status:
        query = query.filter(FollowModel.status == status)
    if scheduled_after:
        query = query.filter(FollowModel.scheduled_date >= scheduled_after)
    if scheduled_before:
        query = query.filter(FollowModel.scheduled_date <= scheduled_before)

    total = query.count()
    items = query.order_by(desc(FollowModel.scheduled_date)).offset((page - 1) * size).limit(size).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size
    }

@router.get("/{follow_up_id}", response_model=FollowUp)
def get_follow_up(follow_up_id: int, db: Session = Depends(get_db)):
    follow = db.query(FollowModel).filter(FollowModel.id == follow_up_id).first()
    if not follow:
        raise HTTPException(status_code=404, detail="Follow-up not found")
    return follow

@router.patch("/{follow_up_id}", response_model=FollowUp)
def update_follow_up(follow_up_id: int, follow_in: FollowUpUpdate, db: Session = Depends(get_db)):
    db_follow = db.query(FollowModel).filter(FollowModel.id == follow_up_id).first()
    if not db_follow:
        raise HTTPException(status_code=404, detail="Follow-up not found")
    
    if follow_in.company_id:
        get_company_or_404(follow_in.company_id, db)
    
    update_data = follow_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_follow, key, value)
    
    db.commit()
    db.refresh(db_follow)
    return db_follow

@router.delete("/{follow_up_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_follow_up(follow_up_id: int, db: Session = Depends(get_db)):
    db_follow = db.query(FollowModel).filter(FollowModel.id == follow_up_id).first()
    if not db_follow:
        raise HTTPException(status_code=404, detail="Follow-up not found")
    db.delete(db_follow)
    db.commit()
    return None
