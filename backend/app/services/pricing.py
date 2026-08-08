from decimal import Decimal
from typing import List
from app.models.quotation import Quotation, QuotationItem
from app.models.sales_order import SalesOrder, SalesOrderItem

class PricingEngine:
    @staticmethod
    def calculate_item_totals(item: QuotationItem):
        # 1. Line Subtotal = Quantity * Unit Price
        item.line_subtotal = item.quantity * item.unit_price
        
        # 2. Line Discount
        discount_amount = item.line_subtotal * (item.discount_pct / Decimal("100.00"))
        
        # 3. Taxable Value
        taxable_value = item.line_subtotal - discount_amount
        
        # 4. Line Tax Amount
        item.line_tax = taxable_value * (item.tax_rate_pct / Decimal("100.00"))
        
        # 5. Line Total
        item.line_total = taxable_value + item.line_tax
        
        return taxable_value

    @classmethod
    def calculate_quotation_totals(cls, quotation: Quotation):
        subtotal = Decimal("0.00")
        tax_total = Decimal("0.00")
        discount_total = Decimal("0.00")
        
        for item in quotation.items:
            # Re-calculate item totals
            taxable_value = cls.calculate_item_totals(item)
            
            subtotal += taxable_value
            tax_total += item.line_tax
            discount_total += item.quantity * item.unit_price * (item.discount_pct / Decimal("100.00"))
            
        quotation.subtotal = subtotal
        quotation.tax_total = tax_total
        quotation.discount_total = discount_total
        
        # Grand Total = Subtotal + Tax Total + Freight + Insurance + Other Charges
        quotation.grand_total = (
            quotation.subtotal + 
            quotation.tax_total + 
            quotation.freight + 
            quotation.insurance + 
            quotation.other_charges
        )

    @classmethod
    def calculate_sales_order_totals(cls, sales_order: SalesOrder):
        subtotal = Decimal("0.00")
        tax_total = Decimal("0.00")
        
        for item in sales_order.items:
            # Line Total = Quantity * Unit Price + Tax
            # Sales Order items tax_rate is already applied?
            # Looking at model: item.line_total is provided.
            # Sales order doesn't have discount_pct in items model,
            # so I assume line_total = quantity * unit_price + tax
            # Wait, item.line_total is part of SalesOrderItem.
            
            # For now, just sum them up
            subtotal += (item.quantity * item.unit_price)
            # Assuming tax_rate in item is percentage
            item_tax = (item.quantity * item.unit_price) * (item.tax_rate / Decimal("100.00"))
            tax_total += item_tax
            # Ensure line_total matches
            item.line_total = (item.quantity * item.unit_price) + item_tax

        sales_order.subtotal = subtotal
        sales_order.tax_amount = tax_total
        
        # Grand Total = Subtotal + Tax + Freight
        sales_order.grand_total = (
            sales_order.subtotal + 
            sales_order.tax_amount + 
            sales_order.freight
        )
