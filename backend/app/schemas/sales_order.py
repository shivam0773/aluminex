from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import date
from decimal import Decimal

class SalesOrderItemBase(BaseModel):
    product_id: Optional[int] = None
    product_code_snapshot: str
    product_name_snapshot: str
    description_snapshot: Optional[str] = None
    quantity: Decimal
    unit: str = "MT"
    unit_price: Decimal
    tax_rate: Decimal = Decimal("0.00")
    line_total: Decimal

class SalesOrderItemCreate(SalesOrderItemBase):
    pass

class SalesOrderItem(SalesOrderItemBase):
    id: int
    sales_order_id: int
    
    model_config = ConfigDict(from_attributes=True)

class SalesOrderBase(BaseModel):
    order_number: str
    quotation_id: Optional[int] = None
    company_id: int
    contact_person_id: Optional[int] = None
    order_date: date
    expected_delivery_date: Optional[date] = None
    currency: str = "USD"
    subtotal: Decimal
    tax_amount: Decimal
    freight: Decimal
    grand_total: Decimal
    notes: Optional[str] = None

class SalesOrderCreate(SalesOrderBase):
    items: List[SalesOrderItemCreate]

class SalesOrderUpdate(BaseModel):
    order_date: Optional[date] = None
    expected_delivery_date: Optional[date] = None
    status: Optional[str] = None
    subtotal: Optional[Decimal] = None
    tax_amount: Optional[Decimal] = None
    freight: Optional[Decimal] = None
    grand_total: Optional[Decimal] = None
    notes: Optional[str] = None
    items: Optional[List[SalesOrderItemCreate]] = None

class SalesOrder(SalesOrderBase):
    id: int
    status: str
    items: List[SalesOrderItem]
    
    model_config = ConfigDict(from_attributes=True)

class SalesOrderPaginated(BaseModel):
    items: List[SalesOrder]
    total: int
    page: int
    size: int
