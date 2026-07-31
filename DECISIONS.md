# Architectural Decisions: ALUMINEX Trading Platform

This document records the foundational technical and architectural decisions for the ALUMINEX AI Trading OS.

---

### Decision 1: Modular Monolith Architecture
*   **Context:** The platform requires tight integration between CRM, inventory, and document generation, but must remain scalable as AI modules are added. A full microservices approach would introduce premature complexity for the current team size.
*   **Result:** We will implement a **Modular Monolith** using FastAPI. Each functional area (CRM, Documents, AI Assistant) will be a self-contained module within the same codebase, sharing a database but maintaining strict interface boundaries.
*   **Status:** Accepted

### Decision 2: PostgreSQL with JSONB for Metallurgical Specs
*   **Context:** Aluminium buyers and suppliers have highly variable chemical specification requirements (e.g., AA6063 vs. P1020) and logistics preferences that don't fit into a rigid relational schema.
*   **Result:** Use **PostgreSQL** as the primary database, utilizing **JSONB** columns for flexible metallurgical specifications, buyer mandates, and dynamic trade terms while maintaining relational integrity for core entities.
*   **Status:** Accepted

### Decision 3: Supabase for Authentication and Real-time Sync
*   **Context:** Traders require high-security authentication (MFA) and real-time updates for LME price feeds and deal status changes. Building a custom auth and websocket layer is not core to our value proposition.
*   **Result:** Adopt **Supabase Auth** for enterprise-grade security and **Supabase Realtime** for synchronizing market data and notifications across the frontend.
*   **Status:** Accepted

### Decision 4: Next.js (App Router) for the Frontend
*   **Context:** The platform needs to be highly interactive (for trade dashboards) while maintaining excellent SEO and performance for lead intelligence modules.
*   **Result:** Standardize on **Next.js** with the **App Router** and **TypeScript** to provide a fast, type-safe, and modern user experience.
*   **Status:** Accepted

### Decision 5: FastAPI for the Backend
*   **Context:** The backend must handle heavy data processing (customs logs), PDF parsing (spectrometer reports), and AI model orchestration. Python is the industry standard for these tasks.
*   **Result:** Use **FastAPI** as the backend framework due to its high performance, asynchronous support, and native integration with Python's data science and AI ecosystem.
*   **Status:** Accepted
