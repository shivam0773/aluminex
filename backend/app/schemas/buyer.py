from typing import List, Optional
from pydantic import BaseModel, EmailStr, HttpUrl
from datetime import datetime
from app.models.buyer import CompanyStatus, ProductType, CommunicationChannel, FollowUpStatus

# --- Common Mixins ---
class TimestampSchema(BaseModel):
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Address ---
class AddressBase(BaseModel):
    country: str
    state: str
    city: str
    address_line: str
    google_maps_url: Optional[str] = None

class AddressCreate(AddressBase):
    pass

class AddressUpdate(BaseModel):
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    address_line: Optional[str] = None
    google_maps_url: Optional[str] = None

class Address(AddressBase):
    id: int
    company_id: int

    class Config:
        from_attributes = True

# --- Contact Person ---
class ContactPersonBase(BaseModel):
    name: str
    designation: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    linkedin: Optional[str] = None

class ContactPersonCreate(ContactPersonBase):
    company_id: int

class ContactPersonUpdate(BaseModel):
    name: Optional[str] = None
    designation: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    linkedin: Optional[str] = None

class ContactPerson(ContactPersonBase):
    id: int
    company_id: int

    class Config:
        from_attributes = True

# --- Product Interest ---
class ProductInterestBase(BaseModel):
    product: ProductType
    notes: Optional[str] = None

class ProductInterestCreate(ProductInterestBase):
    company_id: int

class ProductInterest(ProductInterestBase):
    id: int
    company_id: int

    class Config:
        from_attributes = True

# --- Note ---
class NoteBase(BaseModel):
    content: str

class NoteCreate(NoteBase):
    company_id: int

class Note(NoteBase, TimestampSchema):
    id: int
    company_id: int

# --- Follow Up ---
class FollowUpBase(BaseModel):
    scheduled_date: datetime
    task_description: str
    status: FollowUpStatus = FollowUpStatus.PENDING

class FollowUpCreate(FollowUpBase):
    company_id: int

class FollowUpUpdate(BaseModel):
    company_id: Optional[int] = None
    scheduled_date: Optional[datetime] = None
    task_description: Optional[str] = None
    status: Optional[FollowUpStatus] = None

class FollowUp(FollowUpBase, TimestampSchema):
    id: int
    company_id: int

class FollowUpList(BaseModel):
    items: List[FollowUp]
    total: int
    page: int
    size: int

# --- Communication History ---
class CommunicationHistoryBase(BaseModel):
    channel: CommunicationChannel
    summary: str
    date: datetime = datetime.utcnow()
    contact_person_id: Optional[int] = None

class CommunicationHistoryCreate(CommunicationHistoryBase):
    company_id: int

class CommunicationHistory(CommunicationHistoryBase, TimestampSchema):
    id: int
    company_id: int

class CommunicationHistoryUpdate(BaseModel):
    company_id: Optional[int] = None
    contact_person_id: Optional[int] = None
    channel: Optional[CommunicationChannel] = None
    summary: Optional[str] = None
    date: Optional[datetime] = None

class CommunicationHistoryList(BaseModel):
    items: List[CommunicationHistory]
    total: int
    page: int
    size: int

# --- Company ---
class CompanyBase(BaseModel):
    name: str
    industry: Optional[str] = None
    company_type: Optional[str] = None
    website: Optional[str] = None
    gst: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    linkedin: Optional[str] = None
    annual_capacity: Optional[float] = None
    status: CompanyStatus = CompanyStatus.LEAD
    lead_source: Optional[str] = None

class CompanyCreate(CompanyBase):
    addresses: List[AddressCreate] = []
    product_interests: List[ProductType] = []

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    company_type: Optional[str] = None
    website: Optional[str] = None
    gst: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    linkedin: Optional[str] = None
    annual_capacity: Optional[float] = None
    status: Optional[CompanyStatus] = None
    lead_source: Optional[str] = None

class Company(CompanyBase, TimestampSchema):
    id: int
    addresses: List[Address] = []
    contacts: List[ContactPerson] = []
    product_interests: List[ProductInterest] = []

    class Config:
        from_attributes = True

class CompanyList(BaseModel):
    items: List[Company]
    total: int
    page: int
    size: int

class ContactPersonList(BaseModel):
    items: List[ContactPerson]
    total: int
    page: int
    size: int
