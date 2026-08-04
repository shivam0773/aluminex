# Aluminex Development Guide

This document outlines the architectural standards, coding conventions, and best practices for the Aluminex project.

## 1. Project Overview
Aluminex is the AI-powered operating system for the global aluminium trading industry.

## 2. Tech Stack
*   **Frontend:** React, Vite, Material UI (MUI).
*   **Backend:** Python, FastAPI, SQLAlchemy.
*   **Database:** PostgreSQL.
*   **API:** RESTful JSON APIs.

## 3. Architecture
The project structure is organized as follows:
*   **Backend:** `api`, `core`, `models`, `schemas`, `services`, `utils`.
*   **Frontend:** `components`, `pages`, `contexts`, `hooks`, `services`.

## 4. Coding Conventions

### Backend
*   Uses synchronous FastAPI endpoints with SQLAlchemy Session.
*   Implement Pydantic schemas for data validation.

### Frontend
*   Functional components with Hooks.
*   Use `services` directory for API client wrappers.
*   Use Material UI components for consistency.

## 5. API Standards
*   Endpoints must be RESTful (`/api/v1/...`).
*   Consistent error responses.
*   Pagination: Uses `page` and `size` query parameters.
*   Response format: `{ "items": [], "total": number, "page": number, "size": number }`

## 6. Mandatory Module Standards
Each module must implement the following:
*   List page (with Search, Filters, Pagination)
*   Details page (where relevant)
*   Add (with Dialog/Form/Validation)
*   Edit (with Dialog/Form/Validation)
*   Delete (with Confirmation Dialog)
*   Reusable form and dialog components
*   Loading, error, and empty states
*   Snackbar notifications for success/error
*   API service functions
*   Responsive design using Material UI
*   Frontend route registration
*   Backend router registration
*   Company/entity existence validation for foreign keys

## 7. Development Workflow
*   Read this guide before each task.
*   Do not modify completed modules unless explicitly requested.
*   Implement only the requested module.
*   Summarize files created and modified after each task.
*   Review code thoroughly before testing.
*   Test all CRUD and details routes.
*   Commit every completed module with Git.

## 8. Completed Modules
*   Companies
*   Contacts

## 9. Roadmap
*   Follow-ups
*   Communication History
*   Notes
*   Dashboard
*   Authentication
*   AI Assistant
