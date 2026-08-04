from sqlalchemy.orm import Session
from app.models.buyer import Company


def get_all_companies(db: Session):
    return db.query(Company).all()


def get_company(db: Session, company_id: int):
    return db.query(Company).filter(Company.id == company_id).first()


def create_company(db: Session, company):
    db.add(company)
    db.commit()
    db.refresh(company)
    return company