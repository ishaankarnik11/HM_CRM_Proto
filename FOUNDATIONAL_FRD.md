# MyHealthMeter CRM – Foundational Functional Requirements Document (FRD)

**Version:** v0.2
**Date:** 2025-09-10
**Prepared for:** MyHealthMeter (MHM)

This document captures the core functional behaviour of the new MHM CRM. It consolidates all master data definitions under a single **Masters** section and outlines the flows required to onboard contracts, configure plans, manage diagnostic centres and standardise investigations. Technical design and UI wireframes are outside the scope of this document.

---

## 1. Objective & Background

The CRM must onboard corporate contracts, define health-check plans, maintain diagnostic centre catalogues and standardise clinical investigations and taxonomies. The system reuses patterns from the legacy CRM while introducing cleaner masters and linkages.

---

## 2. High-Level Domains & Relationships

- **Corporate** has one or more **Contracts**.
- **Contracts** optionally scope **Entities** and **Locations**.
- **Contracts** have **Corporate Plans** (AHC and/or PEC) segmented by **Gender** and **Age band**.
- **Diagnostic Centers (DCs)** maintain their own **DC Plans** (centre price lists).
- **Corporate Plans** map to **DC Plans** per *(Contract × DC)* with optional investigation-level selections.
- **Investigations** are reusable tests/items and are linked to **Meters** (analytics taxonomy).
- **Service Types** categorise services and are referenced by plans where applicable.
- **OPD** settings configure contract level OPD enablement and wallet details.
- **Dependents** and **HR Contacts** are people masters linked to corporates/entities/locations.

```
Corporate ──< Contract ──< Entity ──< Location
             │
             ├──< CorporatePlan(AHC/PEC) ──< CorporatePlanItem(Investigations, add‑ons)
             │                                 │
             │                                 └── Investigations ──< Investigation↔Meter
             │
             └── (per DC) Mapping: CorporatePlan ──< ContractDCPlanMap >── DCPlan ──< DC
```

---

## 3. Masters

### 3.1 Corporate & Contract Master
**Purpose:** Manage corporate onboarding, program toggles, branding assets and operational settings.

**Key Fields**
- Corporate: `corporate_id`, `corporate_name`, `status` (Active/Inactive).
- Contract: `contract_id`, **`contract_no` (unique)**, `contract_name`, `start_date`, `end_date`, `status` (Draft/Active/Expired/Archived), contacts, doctor/HR user invites, program toggles, payment & population, HRA configuration, operational flags, branding assets, business groups, FHP checklists and invoicing fields.

**Validations & Rules**
- `contract_no` unique.
- `end_date ≥ start_date`; `status=Expired` when `end_date` < today.
- Conditional validations for HRA, onsite camps, business groups etc.
- Asset uploads validate type, size and dimensions.

### 3.2 Corporate Plans (AHC & PEC)
**Purpose:** Define contract-scoped corporate plans for AHC and PEC.

**Common Fields**: `plan_id`, `contract_id`, `plan_type` (AHC/PEC), `category_id`, `plan_name`, `gender`, `age_from`, `age_to`, `corporate_price`, `status`, `notes`.

**AHC Specific:** structured investigation selections, instructions, coins (`candidate_coins`, `hr_coins`), meter mappings and add-ons.

**PEC Specific:** free-text areas for investigations, imaging and consultations (no coins or meter mapping in v1).

**Validations:** `plan_name` unique per contract/type/gender/age band, `age_from ≤ age_to`, `corporate_price ≥ 0`, AHC requires at least one investigation or add-on.

### 3.3 Diagnostic Centers & DC Plans
**Purpose:** Maintain DC directory and their plan catalogues; link corporate plans to DC plans.

**DC Fields:** `dc_id`, `name`, `registration_name`, contacts, address, `lat`, `lng`, `status`, `document_status`, `consent_form_ref`, audit fields.

**DC Plan Fields:** `dc_plan_id`, `dc_id`, `plan_code`, `plan_name`, `actual_price`, `center_price`, `mhm_price`, documents and `status`.

**Mapping Rules:** Map each Corporate Plan to one or more DC Plans per contract and DC; optional investigation selections; duplicate mappings prevented; DCs require coordinates to be discoverable.

### 3.4 Investigation Master & Meter Taxonomy
**Purpose:** Central catalogue of investigations/tests tagged with meter categories for analytics.

**Fields:** `investigation_id`, `name`, `image_ref`, `type` (Lab Test/Imaging/Consultation/NA), `category`, `quickbook_flag`, `quickbook_sequence`, `status`.

**Relationships:** Many-to-many links to Corporate Plans and to Meters; meters grouped under meter categories.

### 3.5 Entity Master
Represents business units or legal entities under a Corporate, optionally bounded by a Contract.

**Fields:** `entity_id`, `corporate_id`, `contract_id?`, `entity_code` (unique per corporate), `entity_name`, `status`, `notes`.

**Rules:** `entity_code` unique within corporate; cannot delete when locations exist.

### 3.6 Location Master
Physical locations under an Entity.

**Fields:** `location_id`, `entity_id`, `location_code` (unique per entity), `location_name`, `address`, `city`, `state`, `pincode`, `lat`, `lng`, `status`.

**Rules:** unique `location_code`, coordinates required for location services, cannot delete if tied to active contracts.

### 3.7 Service Types Master
Standardised service taxonomy used by plans and DC capabilities.

**Fields:** `service_type_id`, `code` (unique), `name`, `description`, `category` (AHC/PEC/OPD/Imaging/Lab/Consultation/Other), `status`.

**Usage:** Taggable on Corporate Plans, DC Plans and investigation links; supports bulk import/export.

### 3.8 Dependent Master
Dependents of employees when population scope includes dependents.

**Fields:** `dependent_id`, `employee_id`, `corporate_id`, `relationship`, `first_name`, `last_name`, `gender`, `dob`, optional contacts, `status`.

**Rules:** Creation blocked if contract population scope is employee only.

### 3.9 HR Contacts Master
HR contacts at corporate/entity/location levels.

**Fields:** `hr_contact_id`, `level` (Corporate/Entity/Location), `corporate_id`, optional `entity_id` & `location_id`, `name`, `email`, `phone`, `role` (SPOC/Approver/Escalation), `comm_prefs`, `status`.

**Rules:** Email unique per (corporate, level, scope); warn if corporate lacks a SPOC.

### 3.10 OPD Master
Configure OPD benefits at the contract level.

**Contract Settings:** enable flag, funding type (Insurance-backed/Corporate-backed), cashless service list, reimbursement service list, insurance details (insurer, group policy number, group sum assured, optional dates and attachments), notes.

**Validations:** OPD enablement requires funding type; insurance-backed requires group policy number and sum assured; at least one service in cashless or reimbursement lists; all changes audited.

---

## 4. Cross-Cutting Requirements

- List views support search, filter, pagination, sorting and CSV export.
- Forms implement inline and server validations with unsaved changes guard and toast messages.
- Soft delete/archive where deletion is unsafe; uniqueness enforced with clear messages.
- Detail screens expose History/Audit tabs with created/updated metadata.
- Import/export pipelines: staging → validate → apply with downloadable error CSV for supported masters (Investigations, Service Types, HR Contacts, DC Plans, Corporate Plans).
- Stable codes/slugs for key entities such as Entity, Location, Service Type and Plan codes.
- Prices are non-negative decimals (INR by default); coins are integers ≥ 0.
- Guard against mapping mismatched plan types and warn on conflicting demographic constraints.
- PII masking in logs and audit retention for one year.

---

## 5. End-to-End Flows

### 5.1 Contract Onboarding
1. Create Contract via wizard (Basics → Users → Programs & Toggles → Branding → Business Groups & FHP → Invoice & Review/Publish).
2. Publish contract to Active after validations pass.
3. Define Corporate Plans (AHC/PEC) under the contract.
4. Map Corporate Plans to DC Plans for each participating DC.

### 5.2 Corporate Plan Creation
- **AHC:** choose category, demographics and price, select investigations/imaging/consultations, map meters, define add-ons and coins.
- **PEC:** choose category, demographics and price, enter free-text for investigations/imaging/consultations.

### 5.3 DC Plan Maintenance
DC admins manage plan code/name and price layers. Status controls availability for mapping.

### 5.4 Investigation Governance
Data Ops creates investigations, tags meters and reviews usage via "Preview Plans" before editing.

---

## 6. Out of Scope

- Eligibility engine and complex rule evaluation beyond simple flags.
- Member onboarding, booking and fulfilment flows.
- Billing/AR/AP automation (Quickbook flags only).
- Member wallets or claim processing for OPD benefits.

---

## 7. Acceptance Criteria

- Contracts can be created, published and validated with all conditional rules.
- AHC and PEC plans can be created with their respective field behaviours and validations.
- Corporate Plans map to DC Plans per contract and DC with persisted mappings.
- Investigation list supports meter tagging and plan usage preview.
- Masters (Entity, Location, Service Types, Dependents, HR Contacts) provide full CRUD with search, filters, export and audit tabs.
- OPD settings can be configured with funding type, service lists and insurance details; summary visible on Contract detail.

---

## 8. Open Questions

1. Exact image dimension constraints for branding assets.
2. Semantics of Actual vs Centre vs MHM price for DC plans.
3. Whether Gender "Others" is permitted in PEC plans.
4. Scope of Quickbook integration for investigations.
5. Are plan categories global or contract-scoped?

