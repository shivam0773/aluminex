from typing import List, Optional
from pydantic import BaseModel, Field, validator
from datetime import date, datetime
from decimal import Decimal
from app.models.quotation import QuotationStatus

# --- Item Schemas ---

class QuotationItemBase(BaseModel):
    product_id: Optional[int] = None
    product_code: str
    product_name: str
    description: Optional[str] = None
    quantity: Decimal = Field(..., gt=0)
    unit: str = "MT"
    unit_price: Decimal = Field(..., ge=0)
    discount_pct: Decimal = Field(Decimal("0.00"), ge=0, le=100)
    tax_rate_pct: Decimal = Field(Decimal("0.00"), ge=0, le=100)
    alloy_notes: Optional[str] = None

class QuotationItemCreate(QuotationItemBase):
    pass

class QuotationItemUpdate(BaseModel):
    product_id: Optional[int] = None
    product_code: Optional[str] = None
    product_name: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[Decimal] = Field(None, gt=0)
    unit: Optional[str] = None
    unit_price: Optional[Decimal] = Field(None, ge=0)
    discount_pct: Optional[Decimal] = Field(None, ge=0, le=100)
    tax_rate_pct: Optional[Decimal] = Field(None, ge=0, le=100)
    alloy_notes: Optional[str] = None

class QuotationItem(QuotationItemBase):
    id: int
    quotation_id: int
    line_subtotal: Decimal
    line_tax: Decimal
    line_total: Decimal

    class Config:
        from_attributes = True

# --- Quotation Schemas ---

class QuotationBase(BaseModel):
    company_id: int
    contact_person_id: Optional[int] = None
    quotation_date: date = Field(default_factory=date.today)
    validity_date: date
    currency: str = "USD"
    exchange_rate: Decimal = Decimal("1.0000")
    payment_terms: Optional[str] = None
    delivery_terms: Optional[str] = None
    incoterm: Optional[str] = None
    destination: Optional[str] = None
    remarks: Optional[str] = None
    internal_notes: Optional[str] = None
    freight: Decimal = Decimal("0.00")
    insurance: Decimal = Decimal("0.00")
    other_charges: Decimal = Decimal("0.00")

    @validator('validity_date')
    def validity_date_must_be_after_quotation_date(cls, v, values):
        if 'quotation_date' in values and v < values['quotation_date']:
            raise ValueError('validity_date must be greater than or equal to quotation_date')
        return v

class QuotationCreate(QuotationBase):
    quotation_number: str
    items: List[QuotationItemCreate] = Field(..., min_items=1)

class QuotationUpdate(BaseModel):
    company_id: Optional[int] = None
    contact_person_id: Optional[int] = None
    quotation_date: Optional[date] = None
    validity_date: Optional[date] = None
    status: Optional[QuotationStatus] = None
    currency: Optional[str] = None
    exchange_rate: Optional[Decimal] = None
    payment_terms: Optional[str] = None
    delivery_terms: Optional[str] = None
    incoterm: Optional[str] = None
    destination: Optional[str] = None
    remarks: Optional[str] = None
    internal_notes: Optional[str] = None
    freight: Optional[Decimal] = None
    insurance: Optional[Decimal] = None
    other_charges: Optional[Decimal] = None
    items: Optional[List[QuotationItemCreate]] = None

class Quotation(QuotationBase):
    id: int
    quotation_number: str
    version_number: int
    status: QuotationStatus
    subtotal: Decimal
    discount_total: Decimal
    tax_total: Decimal
    grand_total: Decimal
    created_at: datetime
    updated_at: datetime
    items: List[QuotationItem]

    class Config:
        from_attributes = True
        anystr_strip_whitespace = True

class QuotationList(BaseModel):
    items: List[Quotation]
    total: int
    page: int
    size: int
