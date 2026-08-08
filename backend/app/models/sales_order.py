import enum
from typing import List, Optional
from sqlalchemy import String, Enum, ForeignKey, Text, Date, DateTime, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date, datetime
from decimal import Decimal

from app.models.base import Base, TimestampMixin

class SalesOrderStatus(str, enum.Enum):
    DRAFT = "Draft"
    CONFIRMED = "Confirmed"
    PROCESSING = "Processing"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class SalesOrder(Base, TimestampMixin):
    __tablename__ = "sales_orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_number: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    quotation_id: Mapped[Optional[int]] = mapped_column(ForeignKey("quotations.id"), nullable=True)
    
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"))
    contact_person_id: Mapped[Optional[int]] = mapped_column(ForeignKey("contact_persons.id"))
    
    order_date: Mapped[date] = mapped_column(Date, default=date.today)
    expected_delivery_date: Mapped[Optional[date]] = mapped_column(Date)
    
    status: Mapped[SalesOrderStatus] = mapped_column(Enum(SalesOrderStatus), default=SalesOrderStatus.DRAFT)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    
    # Totals
    subtotal: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0.00"))
    tax_amount: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0.00"))
    freight: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0.00"))
    grand_total: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0.00"))
    
    notes: Mapped[Optional[str]] = mapped_column(Text)

    # Relationships
    company: Mapped["Company"] = relationship()
    contact_person: Mapped[Optional["ContactPerson"]] = relationship()
    quotation: Mapped[Optional["Quotation"]] = relationship()
    items: Mapped[List["SalesOrderItem"]] = relationship(back_populates="sales_order", cascade="all, delete-orphan")

class SalesOrderItem(Base):
    __tablename__ = "sales_order_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    sales_order_id: Mapped[int] = mapped_column(ForeignKey("sales_orders.id"))
    product_id: Mapped[Optional[int]] = mapped_column(ForeignKey("products.id"))
    
    # Snapshots
    product_code_snapshot: Mapped[str] = mapped_column(String(50))
    product_name_snapshot: Mapped[str] = mapped_column(String(255))
    description_snapshot: Mapped[Optional[str]] = mapped_column(Text)
    
    quantity: Mapped[Decimal] = mapped_column(Numeric(12, 4))
    unit: Mapped[str] = mapped_column(String(20), default="MT")
    unit_price: Mapped[Decimal] = mapped_column(Numeric(15, 2))
    tax_rate: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=Decimal("0.00"))
    line_total: Mapped[Decimal] = mapped_column(Numeric(15, 2))
    
    sales_order: Mapped["SalesOrder"] = relationship(back_populates="items")
    product: Mapped[Optional["Product"]] = relationship()
