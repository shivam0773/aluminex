# Technical Specification: Quotations Module

## 1. Business Workflow

The Quotations module is the bridge between CRM and Order Execution. It handles the full lifecycle of a trade proposal in the aluminium industry.

### 1.1 Quotation Lifecycle & Statuses
| Status | Description |
| :--- | :--- |
| **Draft** | Initial creation. Editable by the creator. Not visible to the customer. |
| **Pending Approval** | Submitted for internal review. Read-only for the creator. |
| **Approved** | Internally cleared for sending. Ready for PDF generation. |
| **Rejected (Internal)**| Denied by a manager. Returns to Draft for correction. |
| **Sent** | PDF generated and shared with the customer. |
| **Viewed** | Customer has opened the quotation (tracked via link/read receipt). |
| **Negotiation** | Active discussion phase. Price/terms being revised. |
| **Accepted** | Customer has confirmed the quote. Locked for conversion. |
| **Rejected (Customer)**| Customer declined the quote. |
| **Expired** | Validity date has passed without acceptance. |
| **Converted to Order** | Sales Order has been generated. Final stage. |
| **Cancelled** | Voided at any stage (except Converted). |

### 1.2 Status Transitions
*   **Draft -> Pending Approval:** Action: "Submit for Approval".
*   **Pending Approval -> Approved:** Action: "Approve" (Manager).
*   **Pending Approval -> Rejected (Internal):** Action: "Reject" (Manager). Reason required.
*   **Approved -> Sent:** Action: "Mark as Sent" or "Email PDF".
*   **Sent -> Accepted:** Action: "Accept Quote".
*   **Accepted -> Converted to Order:** Action: "Generate Sales Order".

### 1.3 Immutability & Versioning
*   **Read-Only:** Once a quotation is `Approved`, `Sent`, `Accepted`, or `Converted`, it becomes read-only.
*   **Revisions:** If a `Sent` quotation needs changes (Negotiation), the user must "Create Revision". This clones the quotation, increments the `version_number`, and sets the old version to `Superseded` (or archived).
*   **Accepted Quotes:** Cannot be edited. If a mistake is found, it must be `Cancelled` and a new quote created, or reverted to `Negotiation` (with manager override).

---

## 2. Database Design (PostgreSQL)

### 2.1 Model: `Quotation`
| Field | Type | Required | Default | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `id` | Integer | Yes | PK | |
| `quotation_number` | String(50) | Yes | | Unique. e.g., ALX-Q-2026-000001 |
| `version_number` | Integer | Yes | 1 | Increments on revision. |
| `company_id` | Integer | Yes | FK | `companies.id`, ON DELETE PROTECT |
| `contact_person_id`| Integer | No | FK | `contact_persons.id`, ON DELETE SET NULL |
| `quotation_date` | Date | Yes | Current | |
| `validity_date` | Date | Yes | +30 Days | |
| `status` | Enum | Yes | DRAFT | |
| `currency` | String(3) | Yes | USD | ISO Code |
| `exchange_rate` | Numeric(12,4)| Yes | 1.00 | Rate relative to base currency |
| `payment_terms` | String(255) | No | | e.g., Net 30 |
| `delivery_terms` | String(255) | No | | |
| `incoterm` | String(3) | No | | e.g., CIF, FOB |
| `destination` | String(255) | No | | Port/City |
| `remarks` | Text | No | | Customer visible |
| `internal_notes` | Text | No | | Team visible |
| `subtotal` | Numeric(15,2)| Yes | 0.00 | Sum of item taxable values |
| `discount_total` | Numeric(15,2)| Yes | 0.00 | |
| `tax_total` | Numeric(15,2)| Yes | 0.00 | Sum of item tax amounts |
| `freight` | Numeric(15,2)| Yes | 0.00 | |
| `insurance` | Numeric(15,2)| Yes | 0.00 | |
| `other_charges` | Numeric(15,2)| Yes | 0.00 | |
| `grand_total` | Numeric(15,2)| Yes | 0.00 | Final calculated value |
| `created_at` | DateTime | Yes | NOW() | |
| `updated_at` | DateTime | Yes | NOW() | |

### 2.2 Model: `QuotationItem`
| Field | Type | Required | Default | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `id` | Integer | Yes | PK | |
| `quotation_id` | Integer | Yes | FK | `quotations.id`, ON DELETE CASCADE |
| `product_id` | Integer | No | FK | `products.id`, ON DELETE SET NULL |
| `product_code` | String(50) | Yes | | **Snapshot** |
| `product_name` | String(255) | Yes | | **Snapshot** |
| `description` | Text | No | | **Snapshot** |
| `quantity` | Numeric(12,4)| Yes | 1.00 | |
| `unit` | String(20) | Yes | MT | e.g., MT, KG |
| `unit_price` | Numeric(15,2)| Yes | 0.00 | |
| `discount_pct` | Numeric(5,2) | Yes | 0.00 | |
| `tax_rate_pct` | Numeric(5,2) | Yes | 0.00 | |
| `line_subtotal` | Numeric(15,2)| Yes | 0.00 | Qty * Price |
| `line_tax` | Numeric(15,2)| Yes | 0.00 | |
| `line_total` | Numeric(15,2)| Yes | 0.00 | Subtotal + Tax - Discount |
| `alloy_notes` | Text | No | | Specific metallurgical specs |

### 2.3 Model: `QuotationApproval`
| Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Yes | PK |
| `quotation_id` | Integer | Yes | FK |
| `approver_id` | Integer | Yes | User ID |
| `status` | Enum | Yes | Approved/Rejected |
| `reason` | Text | No | Required if rejected |
| `created_at` | DateTime | Yes | Timestamp |

### 2.4 Snapshots Explanation
Critical data (`product_code`, `product_name`, `unit_price`, `description`) MUST be snapshotted into `QuotationItem`. If a product's price or description changes in the `Product Catalog` next month, existing quotations must remain accurate records of what was offered at that time.

---

## 3. Numbering Strategy

### 3.1 Format: `ALX-Q-{YEAR}-{SEQUENCE}`
Example: `ALX-Q-2026-000001`

### 3.2 Logic
*   **Uniqueness:** Enforced by a unique constraint on `quotation_number`.
*   **Sequence:** A database-backed sequence per year.
*   **Assignment:** The number is assigned only when the quotation is first moved out of `Draft` status (to `Pending Approval` or `Approved`). Drafts use temporary UUIDs or internal primary keys.
*   **Concurrency:** Use `SELECT ... FOR UPDATE` or atomic increments to prevent duplicate number generation during high-volume periods.

---

## 4. Pricing Engine

### 4.1 Precision
*   All monetary values use **Numeric(15,2)**.
*   Quantities use **Numeric(12,4)** to handle high-precision weights.
*   Rounding: Round to nearest 0.01 at the line-item total level.

### 4.2 Formulas
1.  **Line Subtotal** = `Quantity` * `Unit Price`
2.  **Line Discount** = `Line Subtotal` * (`Discount Pct` / 100)
3.  **Line Taxable Value** = `Line Subtotal` - `Line Discount`
4.  **Line Tax Amount** = `Line Taxable Value` * (`Tax Rate Pct` / 100)
5.  **Line Total** = `Line Taxable Value` + `Line Tax Amount`
6.  **Quotation Subtotal** = Sum of all `Line Taxable Values`
7.  **Quotation Tax Total** = Sum of all `Line Tax Amounts`
8.  **Grand Total** = `Quotation Subtotal` + `Quotation Tax Total` + `Freight` + `Insurance` + `Other Charges`

### 4.3 Multicurrency
*   Store all `grand_total` values in both local currency and a base "Accounting" currency (e.g., USD) using the `exchange_rate` at the time of quotation.

---

## 5. Validation Rules

### 5.1 Backend Validation
*   **Status Guards:** `Update` is forbidden if status is not `Draft` or `Negotiation`.
*   **Company/Contact:** Contact must belong to the selected Company.
*   **Dates:** `validity_date` >= `quotation_date`.
*   **Items:** At least one item required before submission.
*   **Transition:** Only allowed transitions (e.g., cannot skip `Approved` to go from `Draft` to `Sent` if approval is required).

---

## 6. API Design

| Method | Path | Action | Allowed Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/quotations` | List (with filters/paging) | Any |
| `POST` | `/api/v1/quotations` | Create Draft | - |
| `GET` | `/api/v1/quotations/{id}` | Get Details | Any |
| `PATCH`| `/api/v1/quotations/{id}` | Update Draft | Draft, Negotiation |
| `DELETE`| `/api/v1/quotations/{id}` | Delete Draft | Draft |
| `POST` | `/api/v1/quotations/{id}/submit`| Submit for Approval | Draft |
| `POST` | `/api/v1/quotations/{id}/approve`| Approve (Manager) | Pending Approval |
| `POST` | `/api/v1/quotations/{id}/send` | Mark as Sent | Approved |
| `POST` | `/api/v1/quotations/{id}/accept` | Customer Acceptance | Sent, Viewed |
| `GET` | `/api/v1/quotations/{id}/pdf` | Generate/Download PDF | Approved+ |

---

## 7. PDF Generation Strategy

*   **Library:** `WeasyPrint` (HTML-to-PDF) for its excellent CSS support, allowing for pixel-perfect branding.
*   **Templates:** Jinja2 templates stored in `backend/app/templates/pdf/`.
*   **Storage:** Once `Sent`, the PDF is generated and stored in S3/Supabase Storage as a permanent snapshot. Regenerating after `Sent` is prohibited unless a new version is created.
*   **Content:** Must include Aluminex logo, Company GST/VAT, Incoterms, and detailed bank details.

---

## 8. Communication & Follow-up Integration

*   **Communication History:** When a quotation is "Sent", an entry is automatically created in `communication_history` with the PDF attached.
*   **Follow-up:** Upon sending, the system prompts the user to create a Follow-up for 3-5 days later to check acceptance.

---

## 9. Security & Audit

*   **Revision History:** Every version change is tracked. The `version_number` increments, and a link to the previous version's ID is maintained.
*   **Audit Log:** All status changes (Who, When, From, To) are stored in an `activity_log` table.
*   **Tamper Protection:** Totals are recalculated on the backend upon every save; frontend-provided totals are ignored and used only for display.

---

## 10. Implementation Plan

### Phase 1: Foundation (3-4 Days)
*   **Database:** Create `Quotations` and `QuotationItems` tables.
*   **Schemas:** Define Pydantic models for request/response.
*   **Basic CRUD:** Backend endpoints for creating/reading drafts.

### Phase 2: Pricing & Validation (2-3 Days)
*   **Logic:** Implement the Pricing Engine service.
*   **Guards:** Implement status-based transition validation.

### Phase 3: Frontend (4-5 Days)
*   **UI:** Build `Quotations` list and complex `QuotationForm` with dynamic row addition.
*   **Flow:** Integrate with `CompanySelector` and `ProductSelector`.

### Phase 4: PDF & Communication (3-4 Days)
*   **Engine:** Setup `WeasyPrint` and Jinja2 templates.
*   **Integration:** Connect to `CommunicationHistory`.

---

## 11. Architecture Review & Risks

*   **Risk:** LME Linkage. Aluminium prices change second-by-second. The current design uses fixed `unit_price`. Future iterations must support "Formula Pricing" (LME Cash + Premium).
*   **Assumption:** Tax rules are simple percentages. Complex multi-state GST or international tax logic is deferred.
*   **Missing:** The current spec doesn't handle "Terms and Conditions" library; it assumes manual entry per quote.
