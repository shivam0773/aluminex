import enum
from typing import List, Optional
from sqlalchemy import String, Enum, ForeignKey, Text, DateTime, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from app.models.base import Base, TimestampMixin

class CompanyStatus(str, enum.Enum):
    LEAD = "Lead"
    CONTACTED = "Contacted"
    NEGOTIATION = "Negotiation"
    CUSTOMER = "Customer"
    LOST = "Lost"

class ProductType(str, enum.Enum):
    LM25 = "LM25"
    ADC12 = "ADC12"
    A380 = "A380"
    A356 = "A356"
    BILLET_6063 = "6063 Billet"
    UBC = "UBC"
    TENSE = "Tense"
    TAINT_TABOR = "Taint Tabor"
    ZORBA = "Zorba"
    CUSTOM = "Custom"

class CommunicationChannel(str, enum.Enum):
    EMAIL = "Email"
    WHATSAPP = "WhatsApp"
    CALL = "Call"
    MEETING = "Meeting"

class FollowUpStatus(str, enum.Enum):
    PENDING = "Pending"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class Company(Base, TimestampMixin):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    industry: Mapped[Optional[str]] = mapped_column(String(100))
    company_type: Mapped[Optional[str]] = mapped_column(String(100))
    website: Mapped[Optional[str]] = mapped_column(String(255))
    gst: Mapped[Optional[str]] = mapped_column(String(50))
    phone: Mapped[Optional[str]] = mapped_column(String(50))
    email: Mapped[Optional[str]] = mapped_column(String(255))
    linkedin: Mapped[Optional[str]] = mapped_column(String(255))
    annual_capacity: Mapped[Optional[float]] = mapped_column(Float)
    status: Mapped[CompanyStatus] = mapped_column(Enum(CompanyStatus), default=CompanyStatus.LEAD)
    lead_source: Mapped[Optional[str]] = mapped_column(String(100))

    # Relationships
    addresses: Mapped[List["Address"]] = relationship(back_populates="company", cascade="all, delete-orphan")
    contacts: Mapped[List["ContactPerson"]] = relationship(back_populates="company", cascade="all, delete-orphan")
    product_interests: Mapped[List["ProductInterest"]] = relationship(back_populates="company", cascade="all, delete-orphan")
    notes: Mapped[List["Note"]] = relationship(back_populates="company", cascade="all, delete-orphan")
    follow_ups: Mapped[List["FollowUp"]] = relationship(back_populates="company", cascade="all, delete-orphan")
    communication_history: Mapped[List["CommunicationHistory"]] = relationship(back_populates="company", cascade="all, delete-orphan")
    quotations: Mapped[List["Quotation"]] = relationship(back_populates="company", cascade="all, delete-orphan")

class Address(Base):
    __tablename__ = "addresses"

    id: Mapped[int] = mapped_column(primary_key=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"))
    country: Mapped[str] = mapped_column(String(100))
    state: Mapped[str] = mapped_column(String(100))
    city: Mapped[str] = mapped_column(String(100))
    address_line: Mapped[str] = mapped_column(Text)
    google_maps_url: Mapped[Optional[str]] = mapped_column(String(500))

    company: Mapped["Company"] = relationship(back_populates="addresses")

class ContactPerson(Base):
    __tablename__ = "contact_persons"

    id: Mapped[int] = mapped_column(primary_key=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"))
    name: Mapped[str] = mapped_column(String(255))
    designation: Mapped[Optional[str]] = mapped_column(String(100))
    email: Mapped[Optional[str]] = mapped_column(String(255))
    phone: Mapped[Optional[str]] = mapped_column(String(50))
    whatsapp: Mapped[Optional[str]] = mapped_column(String(50))
    linkedin: Mapped[Optional[str]] = mapped_column(String(255))

    company: Mapped["Company"] = relationship(back_populates="contacts")
    communications: Mapped[List["CommunicationHistory"]] = relationship(back_populates="contact_person")

class ProductInterest(Base):
    __tablename__ = "product_interests"

    id: Mapped[int] = mapped_column(primary_key=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"))
    product: Mapped[ProductType] = mapped_column(Enum(ProductType))
    notes: Mapped[Optional[str]] = mapped_column(Text)

    company: Mapped["Company"] = relationship(back_populates="product_interests")

class Note(Base, TimestampMixin):
    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(primary_key=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"))
    content: Mapped[str] = mapped_column(Text)

    company: Mapped["Company"] = relationship(back_populates="notes")

class FollowUp(Base, TimestampMixin):
    __tablename__ = "follow_ups"

    id: Mapped[int] = mapped_column(primary_key=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"))
    scheduled_date: Mapped[datetime] = mapped_column(DateTime)
    status: Mapped[FollowUpStatus] = mapped_column(Enum(FollowUpStatus), default=FollowUpStatus.PENDING)
    task_description: Mapped[str] = mapped_column(Text)

    company: Mapped["Company"] = relationship(back_populates="follow_ups")

class CommunicationHistory(Base, TimestampMixin):
    __tablename__ = "communication_history"

    id: Mapped[int] = mapped_column(primary_key=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"))
    contact_person_id: Mapped[Optional[int]] = mapped_column(ForeignKey("contact_persons.id"))
    channel: Mapped[CommunicationChannel] = mapped_column(Enum(CommunicationChannel))
    summary: Mapped[str] = mapped_column(Text)
    date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    company: Mapped["Company"] = relationship(back_populates="communication_history")
    contact_person: Mapped[Optional["ContactPerson"]] = relationship(back_populates="communications")
