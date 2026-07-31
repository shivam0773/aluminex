# ALUMINEX: Product Specification & Roadmap

ALUMINEX is an AI-powered operating system and intelligence platform engineered specifically for **aluminium traders, importers, exporters, recyclers, brokers, and corporate procurement teams**. 

In the physical aluminium market, profits are determined by razor-thin margins, volatile price fluctuations on the London Metal Exchange (LME), complex physical premium surcharges, shipping logistics, and strict metallurgical specifications. ALUMINEX digitizes, automates, and optimizes the daily workflows of physical aluminium trade—moving companies away from legacy spreadsheets and manual emails into an integrated, AI-driven command center.

---

## 1. Vision
To be the definitive global operating system for physical non-ferrous metal trading—powering frictionless, automated, and intelligent aluminium transactions from mine and recycling yards to the final manufacturer.

## 2. Mission
To automate the administrative friction of international metal trade, enrich market and counterparty data, and provide real-time prescriptive trade matching to maximize profitability and mitigate financial and operational risk for aluminium trade desks.

## 3. Target Users
*   **Physical Aluminium Traders & Brokers:** Professionals orchestrating back-to-back trades of primary ingots, billets, wire rods, and scrap, managing margins and hedging price risk.
*   **Importers & Exporters:** Global trade houses handling custom clearances, bulk ocean freight, cross-border payments, and Incoterms compliance.
*   **Industrial Scrap Recyclers:** Yards and secondary refiners buying mixed scrap (e.g., UBCs, Tense, Tabor) and selling graded secondary ingots or heavy melting scrap to extrusion and rolling mills.
*   **Procurement Managers (Extruders & Rolling Mills):** Buying teams securing steady, cost-effective feedstocks of primary metal and scrap to feed production lines.

---

## 4. Problems We Solve

### A. Fragmented, High-Friction Counterparty Matching
Traders spend hours scanning chaotic emails, WhatsApp chats, and PDF offer sheets to find a buyer for a specific lot of material (e.g., AA6063 billets at a Rotterdam Duty-Paid premium) or source high-purity P1020 ingots for an extruder.
*   *ALUMINEX Solution:* Structured, AI-powered buyer and supplier databases that immediately cross-reference incoming scrap batches or primary allocations with buyer requirement profiles.

### B. High Documentation Burden & Compliance Risk
Every shipment of physical aluminium requires a mountain of precise international documents: Bills of Lading, Certificates of Analysis (CoA), Packing Lists, Commercial Invoices, and Letters of Credit (L/C). A single clerical error can lead to expensive customs delays or port demurrage fees.
*   *ALUMINEX Solution:* Automated document generation customized for aluminium trade (HS Codes 7601 and 7602) that extracts data from spectrometer reports and purchase contracts to output flawless trade documents instantly.

### C. Volatile Hedging and Pricing Calculations
Physical metal pricing is rarely fixed. It is calculated dynamically based on the **LME Cash/3-Month price + Physical Premium (e.g., Midwest or Rotterdam) + Alloy Surcharges - Scrap Discounts**. Manually tracking these variables to maintain margins and executing correct hedges is highly prone to calculation errors.
*   *ALUMINEX Solution:* Real-time Market Intelligence dashboards integrating LME data feeds, premium spreads, and a margin calculator that advises on exact hedging needs.

### D. Counterparty Fraud & Credit Defaults
Aluminium cargo has high value, making the trade vulnerable to fraud, duplicate warehouse warrants, and credit defaults by unverified buyers or shell brokers.
*   *ALUMINEX Solution:* Instant AI-driven Company Intelligence that cross-checks corporate records, credit scores, sanctions databases, and trading history before any transaction.

---

## 5. Core Modules

### 👥 Module 1: Buyer Database
*   **Purpose:** Highly structured registry of industrial aluminium buyers (extruders, rolling mills, automotive tier-1s).
*   **Key Features:**
    *   **Product Profile Mapping:** Records specific buying mandates (e.g., AA6061, AA6063, AA6082 extrusion billets, P1020, P0610 primary ingots, wire rods).
    *   **Dimension and Spec Preferences:** Tracks required billet diameters (e.g., 7", 8", 9"), cut lengths, and chemical tolerance caps (e.g., maximum iron content of $0.15\%$).
    *   **Logistics Profiles:** Preferred delivery points (e.g., warehouse, CIF Baltimore, DDP Munich), monthly volume capacities, and credit lines.

### 🏭 Module 2: Supplier Database
*   **Purpose:** Comprehensive intelligence on primary smelters, secondary remelters, and scrap networks.
*   **Key Features:**
    *   **Production Capabilities:** Catalogs smelter/refiner locations, monthly capacity, available shapes (ingots, T-bars, billets), and typical lead times.
    *   **Chemical Assays & Certifications:** Stores standard Mill Test Certificates (MTCs) and green aluminium credentials (low-carbon, ASI certified).
    *   **Scrap Sourcing Matrix:** For scrap yards, maps consistent supplies of categorized scrap grades according to ISRI standards (e.g., UBCs, Tense, Tabor, Zorba).

### 🔍 Module 3: Lead Intelligence
*   **Purpose:** Active lead generation by parsing international trade data.
*   **Key Features:**
    *   **Customs Data Scraping:** Automatically imports and structures global customs logs (using HS codes 7601 and 7602) to identify which companies are importing/exporting what grades and from whom.
    *   **Tender Tracking:** Scrapes government and large private procurement tender portals for aluminium supply bids.
    *   **Intent Extraction:** Scrapes B2B trade portals and forums to capture active buying or selling requirements.

### 🤝 Module 4: CRM (Customer Relationship Management)
*   **Purpose:** Pipeline and deal flow management designed for the physical metals trade.
*   **Key Features:**
    *   **Aluminium Deal Pipelines:** Track progress from "RFQ Received" to "Offer Sent", "Premium Negotiated", "L/C Opened", "In Transit", and "Settled".
    *   **Dynamic Margin Tracking:** Calculates real-time estimated margins on back-to-back deals, factoring in purchase price, LME spread, premium, inland and ocean freight, and financing costs.
    *   **Position Book Integration:** Ensures closed deals automatically feed into the trader’s physical position book (long/short inventory tracking).

### 📦 Module 5: Stock Management
*   **Purpose:** Multi-location tracking of physical aluminium in warehouses, on-dock, or in-transit.
*   **Key Features:**
    *   **Lot & Batch Tracking:** Tracks individual physical lots of metal by batch number, brand (smelter of origin), weight, and specific alloy grade.
    *   **Certificate of Analysis (CoA) Vault:** Digitally binds the official spectrometer/assay PDF to the specific lot of material, allowing instant sharing with prospective buyers.
    *   **In-Transit & Warehouse Visibility:** Tracks container numbers, shipping lines, estimated port of arrival (ETA), and current storage warehouse fees.

### 💬 Module 6: Email & WhatsApp Automation
*   **Purpose:** Highly personalized, high-volume communications for trade indications and follow-ups.
*   **Key Features:**
    *   **Indication Blast Generator:** Generates and distributes daily/weekly pricing lists (Indications) to target buyers based on live LME movements and physical premium levels.
    *   **AI Auto-Quoting:** Reads incoming buyer RFQs in email or WhatsApp, parses the requested alloy and delivery location, checks available stocks or supplier offers, and drafts a ready-to-send quotation.
    *   **Shipment Status Alerts:** Automatically messages clients on WhatsApp or Email when their shipping containers are loaded, reach transit milestones, or clear custom borders.

### 🕵️ Module 7: Company Intelligence
*   **Purpose:** Automated due diligence, risk profiling, and KYC (Know Your Customer).
*   **Key Features:**
    *   **Trader Verification:** Crawls corporate registries, VAT registers, and international sanctions lists (OFAC, EU, etc.) to vet suppliers and brokers.
    *   **Financial Health Index:** Integrates with credit scoring services to assess the default risk of buyers seeking credit terms.
    *   **Fraud Detection Warnings:** Flags potential invoice redirection or duplicate warehouse warrant risks based on historical anomaly profiling.

### 📄 Module 8: Document Generator
*   **Purpose:** Automated drafting of complex international trade documentation.
*   **Key Features:**
    *   **Template Automation:** Instant generation of standard Sales Contracts, Purchase Contracts, Proforma Invoices, Commercial Invoices, Packing Lists, and Shipping Instructions.
    *   **Incoterms 2020 Compliance:** Hardcodes precise obligations and cost splits for various Incoterms (CIF, FOB, FCA, DDP, CFR).
    *   **Spectrometer Data Extraction:** Parses spectrometer Certificate of Analysis (CoA) PDFs to automatically populate chemical compositions in sales contracts or custom declarations.

### 🤖 Module 9: AI Aluminium Assistant
*   **Purpose:** Conversational domain-expert AI trained in global metal trading standards.
*   **Key Features:**
    *   **Document Analysis:** Traders can upload 50-page purchase agreements or L/C terms and ask the assistant: *"Identify any non-standard payment terms or quality claim clauses."*
    *   **Technical Translation:** Quickly converts foreign buyer specification sheets (e.g., Chinese GB standards) to equivalent AA (Aluminium Association) or EN standards.
    *   **Instant Conversion Math:** Instantly calculates metric-ton to pound conversions, LME cash-to-three-month spreads, and scrap discount pricing spreads.

### 📈 Module 10: Market Intelligence
*   **Purpose:** Centralized pricing, volatility tracking, and market analytics.
*   **Key Features:**
    *   **LME Ticker & Spreads:** Live display of London Metal Exchange Cash, 3-Month, and Stock Levels, with alerts for backwardation or contango patterns.
    *   **Physical Premium Index:** Aggregated tracking of regional physical premiums (Rotterdam Duty-Paid, US Midwest, MJP).
    *   **Scrap Spread Tracker:** Compares clean scrap prices (e.g., UBCs) against primary LME cash value to help traders calculate dynamic buying discount thresholds.

---

## 6. Development Philosophy
*   **Back-to-Back Workflow Focus:** Design every feature to align with how traders buy and sell concurrently to lock in margins and minimize exposure.
*   **High-Fidelity Document Accuracy:** In physical trade, a misplaced decimal on a chemical limit or packing list is a multi-thousand-dollar mistake. Our document automation must be mathematically and grammatically perfect.
*   **AI as a Force Multiplier:** Build features that allow a single trader or broker to run the volume of a 5-person operation through intensive email, WhatsApp, and document generation automation.

## 7. Tech Stack
*   **Frontend:** Next.js (App/Page routing), React, TypeScript, Tailwind CSS, Recharts (for LME tracking and price curves).
*   **Backend:** Python (FastAPI), Pandas/NumPy (for financial/margin calculations and data ingestion), PyPDF2/PDFPlumber (for document parsing).
*   **Database:** PostgreSQL (via Supabase) with optimized schemas for buyer/supplier profiles and inventory lots.
*   **Authentication & Services:** Supabase Auth and integration with external email/WhatsApp APIs (e.g., Twilio for WhatsApp, Resend/SendGrid for email) and LME/Premium pricing APIs.

---

## 8. Version 0.1 Scope (Minimum Viable Product)
The initial release (v0.1) focuses on solving the most painful bottleneck of physical aluminium traders: **managing counterparties, tracking active traded stock, visualizing market pricing, and automating contract generation**.

### Phase 1: Core MVP Features

1.  **Unified Directory (Buyer & Supplier Databases):**
    *   Centralized hub to manage buyers and suppliers with specialized aluminium profiles (preferred alloy grades, shapes, standard packing, and physical location).
2.  **Market Intelligence Dashboard:**
    *   Simple tracking of LME Cash and 3-Month prices, plus manually input physical premiums, to output live calculated transaction values for specific trade runs.
3.  **Stock & Document Registry (Stock Management):**
    *   Ability to record physical lots of traded material (Batch, Brand, Grade, Location) and upload/link their Certificate of Analysis (CoA) and Packing Lists.
4.  **Aluminium Sales Contract Generator (Document Generator):**
    *   Template engine to generate complete, PDF-exportable Sales and Purchase Contracts based on the buyer, supplier, lot, Incoterms, and selected pricing formula.
5.  **Drafting Assistant (AI Aluminium Assistant):**
    *   A simple chat panel to parse buyer email inquiries (RFQs) and draft professional, structured quotation responses utilizing current stock details and pricing models.
