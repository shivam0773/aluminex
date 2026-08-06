from decimal import Decimal
from typing import List
from app.models.quotation import Quotation, QuotationItem

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
