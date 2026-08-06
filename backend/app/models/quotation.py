import enum
from typing import List, Optional
from sqlalchemy import String, Enum, ForeignKey, Text, Date, DateTime, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date, datetime
from decimal import Decimal

from app.models.base import Base, TimestampMixin

class QuotationStatus(str, enum.Enum):
    DRAFT = "Draft"
    SENT = "Sent"
    ACCEPTED = "Accepted"
    REJECTED = "Rejected"
    CANCELLED = "Cancelled"

class Quotation(Base, TimestampMixin):
    __tablename__ = "quotations"

    id: Mapped[int] = mapped_column(primary_key=True)
    quotation_number: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    version_number: Mapped[int] = mapped_column(default=1)
    
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"))
    contact_person_id: Mapped[Optional[int]] = mapped_column(ForeignKey("contact_persons.id"))
    
    quotation_date: Mapped[date] = mapped_column(Date, default=date.today)
    validity_date: Mapped[date] = mapped_column(Date)
    
    status: Mapped[QuotationStatus] = mapped_column(Enum(QuotationStatus), default=QuotationStatus.DRAFT)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    exchange_rate: Mapped[Decimal] = mapped_column(Numeric(12, 4), default=Decimal("1.0000"))
    
    payment_terms: Mapped[Optional[str]] = mapped_column(String(255))
    delivery_terms: Mapped[Optional[str]] = mapped_column(String(255))
    incoterm: Mapped[Optional[str]] = mapped_column(String(3))
    destination: Mapped[Optional[str]] = mapped_column(String(255))
    
    remarks: Mapped[Optional[str]] = mapped_column(Text)
    internal_notes: Mapped[Optional[str]] = mapped_column(Text)
    
    # Totals
    subtotal: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0.00"))
    discount_total: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0.00"))
    tax_total: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0.00"))
    freight: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0.00"))
    insurance: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0.00"))
    other_charges: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0.00"))
    grand_total: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0.00"))

    # Relationships
    company: Mapped["Company"] = relationship(back_populates="quotations")
    contact_person: Mapped[Optional["ContactPerson"]] = relationship()
    items: Mapped[List["QuotationItem"]] = relationship(back_populates="quotation", cascade="all, delete-orphan")

class QuotationItem(Base):
    __tablename__ = "quotation_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    quotation_id: Mapped[int] = mapped_column(ForeignKey("quotations.id"))
    product_id: Mapped[Optional[int]] = mapped_column(ForeignKey("products.id"))
    
    # Snapshots
    product_code: Mapped[str] = mapped_column(String(50))
    product_name: Mapped[str] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(Text)
    
    quantity: Mapped[Decimal] = mapped_column(Numeric(12, 4))
    unit: Mapped[str] = mapped_column(String(20), default="MT")
    unit_price: Mapped[Decimal] = mapped_column(Numeric(15, 2))
    discount_pct: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=Decimal("0.00"))
    tax_rate_pct: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=Decimal("0.00"))
    
    line_subtotal: Mapped[Decimal] = mapped_column(Numeric(15, 2))
    line_tax: Mapped[Decimal] = mapped_column(Numeric(15, 2))
    line_total: Mapped[Decimal] = mapped_column(Numeric(15, 2))
    
    alloy_notes: Mapped[Optional[str]] = mapped_column(Text)

    quotation: Mapped["Quotation"] = relationship(back_populates="items")
    product: Mapped[Optional["Product"]] = relationship()
