# PRD: MyHealthMeter CRM - Accounting Module

## PRD Writing Guidelines Summary
This document follows industry best practices for Product Requirements Documents (PRDs), including defining product purpose, goals, user personas, features, and acceptance criteria, as outlined by Atlassian, Notion, Zeda.io, and Jama to ensure comprehensive stakeholder alignment and development guidance. ([atlassian.com](https://www.atlassian.com/agile/product-management/requirements?utm_source=chatgpt.com), [notion.com](https://www.notion.com/blog/how-to-write-a-prd?utm_source=chatgpt.com), [zeda.io](https://zeda.io/blog/product-requirement-document?utm_source=chatgpt.com), [jamasoftware.com](https://www.jamasoftware.com/requirements-management-guide/writing-requirements/how-to-write-an-effective-product-requirements-document/?utm_source=chatgpt.com))

## 1. Document Info
- **Author:** Ishaan Karnik, Product Owner
- **Date:** July 2025
- **Version:** 1.0
- **Status:** Draft

## 2. Development Context
- Implementation has begun in Lovable with UI components and flows defined, and integrated into Cursor.
- **Task Master Action:** Review existing Lovable and Cursor implementations to understand current features and structure before extending or modifying modules.

## 3. Purpose & Background
MyHealthMeter CRM provides a unified interface for corporate health checkups and services. The Accounting Module will enable finance teams to generate pro-forma invoices, reconcile diagnostic center (DC) bills, and manage payment dockets within the CRM.

## 4. Objectives & Success Metrics
### Objectives
- Integrate Accounting into left nav for seamless access.
- Automate invoice generation for completed health checkups.
- Reconcile DC bills and streamline payment docket creation.

### Success Metrics
- 90% reduction in manual invoicing time.
- 100% accuracy in DC bill reconciliation.
- User satisfaction score ≥ 4.5/5 for accounting workflows.

## 5. Assumptions & Constraints
### Assumptions
- Completed appointments are marked “Medical Done” in CRM.
- Corporate client data and DC bill data are available via existing APIs.

### Constraints
- Must adhere to current CRM styling and component library.
- Codebase conventions (framework, theming) must be respected.

## 6. Scope
### In Scope
- Receivables (invoice) management.
- DC Bills & Dockets interface.
- Pro-forma invoice preview and PDF download.
- Left nav integration and tabbed navigation.

### Out of Scope
- Post-invoice payment tracking.
- External accounting software integration.

## 7. User Personas
- **Finance Manager:** Generates and reviews invoices for clients.
- **Accounts Payable Clerk:** Uploads and reconciles DC bills, creates dockets.
- **Admin:** Configures invoice and billing settings.

## 8. Functional Requirements
1. **Receivables Dashboard**
   - Dashboard cards for “Receivables” and “DC Bills & Dockets” with action buttons.
2. **Invoice Filter & Search**
   - Date range picker and corporate client dropdown.
   - Search button enabling pro-forma invoice generation.
3. **Invoice Results Table**
   - Table with columns Sl No, Employee Name/ID, Corporate, Appointment Date, Rate, Package Type.
   - Bulk selection checkboxes and “Generate Pro-Forma” action.
4. **Pro-Forma Invoice Modal**
   - Preview invoice with header, billing details, line item table, totals.
   - PO selection dropdown and Print/Download/Close buttons.
5. **DC Bills Management**
   - Filter by Diagnostic Center, Location, date range.
   - Upload DC bill files with drag-and-drop.
   - Save as Draft and Submit Bill actions.
   - Docket management table with draft/submitted status and bulk actions.

## 9. Non-Functional Requirements
- **Performance:** Tables handle >10,000 rows via virtualization.
- **Accessibility:** WCAG 2.1 AA compliance.
- **Security:** Role-based access control for finance roles.
- **Localization:** Support for INR currency and date formats.

## 10. UI/UX & Navigation
- Add “Accounting” to left-hand navigation menu, between Appointment Tracker and Reports.
- Use tabbed navigation within Accounting: “Receivables”, “DC Bills & Dockets”.
- Adhere to existing CRM styling for colors, typography, and components.

## 11. Technical Requirements & Integrations
- Leverage existing CRM REST APIs for appointments and client data.
- New API endpoints: `/api/invoices` and `/api/dc-bills`.
- File upload service integrated with S3 or equivalent storage.

## 12. Dependencies
- Completion of Medical Done status flags.
- Corporate client master data service.
- CRM theming and component library release v2.1.

## 13. Timeline & Milestones
| Milestone                   | Target Date    |
| --------------------------- | -------------- |
| UI Component Development    | July 20, 2025  |
| API Endpoint Implementation | July 27, 2025  |
| Integration & QA            | August 5, 2025 |
| UAT & Sign-off              | August 12, 2025|

## 14. Acceptance Criteria
- All features accessible under the Accounting nav item.
- Invoice generation yields correct PDF with PO field.
- DC bill reconciliation workflow functions end-to-end.
- Passed accessibility and performance tests.

---

