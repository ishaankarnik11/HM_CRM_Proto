# Product Requirements Document (PRD)
## Zoho Reference ID Feature - Accounting Module

**Project:** MyHealthMeter CRM – Accounting Module  
**Feature:** Zoho Reference ID Integration  
**Version:** 1.0  
**Date:** July 24, 2025  
**Document Type:** Product Requirements Document (PRD)

---

## 1. Product Overview

The Zoho Reference ID feature enables seamless integration between the MyHealthMeter CRM Accounting Module and Zoho Books by providing a dedicated field for tracking Zoho Books reference numbers within the CRM system. This feature supports both invoice and DC bill (docket) management workflows, ensuring accurate reconciliation and audit trail maintenance between the two systems.

---

## 2. Problem Statement

Currently, the MyHealthMeter CRM Accounting Module operates independently from Zoho Books, creating challenges in:

- **Manual Reconciliation**: Accounting teams struggle to match CRM-generated invoices and DC bills with their corresponding entries in Zoho Books
- **Audit Trail Gaps**: Lack of connection between CRM financial records and Zoho Books entries creates incomplete audit trails
- **Process Inefficiency**: Manual tracking of reference numbers leads to errors and time-consuming reconciliation processes
- **Data Integrity Issues**: Duplicate or incorrect reference assignments result in accounting discrepancies

---

## 3. Product Objectives

### Primary Objectives
- **Streamline Reconciliation**: Enable quick and accurate matching between CRM records and Zoho Books entries
- **Maintain Data Integrity**: Ensure unique reference number assignment across all financial records
- **Enhance Audit Capabilities**: Provide complete traceability of reference number assignments and changes
- **Improve User Experience**: Offer intuitive, inline editing capabilities for reference number management

### Success Criteria
- Reduce reconciliation time by enabling direct reference lookup
- Eliminate duplicate reference number assignments through system validation
- Provide complete audit trail for all reference number changes
- Enable seamless user workflow with minimal training requirements

---

## 4. User Personas

### Accounting Manager
- **Role**: Oversees all accounting operations and reconciliation processes
- **Needs**: Complete visibility into reference number assignments and audit trails
- **Pain Points**: Manual reconciliation processes and potential data integrity issues

### Accounting Executive
- **Role**: Handles day-to-day invoice generation and docket management
- **Needs**: Quick and easy way to assign and update reference numbers
- **Pain Points**: Time-consuming manual tracking and potential for errors

### Finance Auditor
- **Role**: Reviews financial records and ensures compliance
- **Needs**: Complete audit trail of all reference number changes
- **Pain Points**: Incomplete records and difficulty tracking changes

---

## 5. User Stories

### Epic: Invoice Zoho Reference Management
**As an** Accounting Executive  
**I want to** assign and update Zoho reference numbers for invoices  
**So that** I can easily reconcile CRM invoices with Zoho Books entries

#### User Stories:
1. **As an** Accounting Executive, **I want to** click on the Zoho reference field in the invoice list **so that** I can quickly add a reference number
2. **As an** Accounting Manager, **I want to** search invoices by Zoho reference number **so that** I can quickly locate specific records
3. **As an** Accounting Executive, **I want to** see a save indicator when I update a reference number **so that** I know my changes are being processed
4. **As an** Accounting Executive, **I want to** receive an error message if I try to use a duplicate reference number **so that** I can correct the entry immediately

### Epic: DC Bill Zoho Reference Management
**As an** Accounting Manager  
**I want to** assign Zoho reference numbers to approved DC bills  
**So that** I can track payment processing in Zoho Books

#### User Stories:
1. **As an** Accounting Manager, **I want to** see the Zoho reference field only for approved DC bills **so that** the interface remains clean and relevant
2. **As an** Accounting Manager, **I want to** edit Zoho reference numbers for approved bills **so that** I can update them as needed during payment processing
3. **As an** Accounting Executive, **I want to** view but not edit Zoho reference numbers for paid bills **so that** I can see the reference while maintaining data integrity
4. **As an** Finance Auditor, **I want to** view the complete history of reference number changes **so that** I can audit the reconciliation process

---

## 6. Functional Requirements

### 6.1 Invoice Zoho Reference Management

#### 6.1.1 Reference Number Display and Editing
- Invoice listing table displays a dedicated "Zoho Reference" column
- Field appears empty with placeholder text "Enter Zoho reference" when no value exists
- Clicking on the field enables inline editing mode
- Field accepts alphanumeric characters and common symbols (hyphens, underscores)
- Save indicator (tick mark) appears when user makes changes
- Changes are saved immediately upon clicking the save indicator

#### 6.1.2 Invoice Details Integration
- Zoho reference field appears in invoice header section
- Field maintains same inline editing behavior as in listing view
- Reference number displays prominently alongside other key invoice information

#### 6.1.3 Search and Filter Capabilities
- Global search includes Zoho reference numbers in search scope
- Dedicated filter field for Zoho reference number search
- Filter supports partial matching and wildcards
- Reference numbers included in export functionality

### 6.2 DC Bill Zoho Reference Management

#### 6.2.1 Status-Based Availability
- Zoho reference field not displayed for Draft or Submitted status dockets
- Field becomes visible when docket status changes to Approved
- Field behavior changes based on docket status:
  - **Approved Status**: Fully editable with inline editing capabilities
  - **Paid Status**: Read-only display of assigned reference number

#### 6.2.2 Docket List Integration
- Zoho reference column appears in docket listing table
- Column shows empty state for non-approved dockets
- Inline editing available for approved dockets only
- Read-only display for paid dockets

#### 6.2.3 Docket Details Integration
- Reference field appears in docket header when status is Approved or Paid
- Field behavior matches docket list implementation
- Prominent display alongside other key docket information

### 6.3 System-Wide Validation

#### 6.3.1 Uniqueness Validation
- System validates uniqueness across all invoices and DC bills
- Validation occurs immediately upon save attempt
- Clear error messaging identifies conflicting record type and number
- User can modify entry without losing other form data

#### 6.3.2 Error Handling
- Specific error message format: "This Zoho reference number is already linked to [Invoice/DC Bill] [Number]"
- Error appears inline with the field
- Error clears automatically when user modifies the reference number
- System provides option to view the conflicting record

### 6.4 Activity Logging and Audit Trail

#### 6.4.1 Change Tracking
- All reference number additions logged with timestamp and user information
- All reference number updates logged with previous value, new value, timestamp, and user
- Log entries include entity type (Invoice/DC Bill) and entity number
- Changes appear in entity-specific activity logs

#### 6.4.2 Audit Trail Integration
- Reference number changes appear in comprehensive audit timeline
- Log entries include user avatars and action icons for visual clarity
- Related entity links provided for quick navigation
- Filter capabilities include reference number change events

---

## 7. Business Rules

### 7.1 Reference Number Assignment Rules
- Zoho reference numbers are optional fields that can remain empty
- Reference numbers must be unique across all invoices and DC bills system-wide
- Users can update reference numbers at any time based on their status permissions
- Empty reference numbers do not trigger uniqueness validation

### 7.2 Status-Based Access Rules
- **Invoices**: Reference numbers can be added/edited regardless of invoice status
- **DC Bills**: Reference numbers only available for Approved and Paid status
- **Draft/Submitted DC Bills**: Reference field not displayed or accessible
- **Paid DC Bills**: Reference numbers display as read-only

### 7.3 Data Validation Rules
- Reference numbers accept alphanumeric characters and common business symbols
- Maximum length constraints apply based on Zoho Books limitations
- Leading and trailing whitespace automatically trimmed
- Case sensitivity maintained as entered by user

### 7.4 Change Management Rules
- All reference number changes immediately logged in audit trail
- Users cannot bypass uniqueness validation
- System maintains complete history of all reference number changes
- No deletion of reference numbers once assigned (only updates permitted)

---

## 8. Success Metrics

### 8.1 Operational Efficiency Metrics
- **Reconciliation Time**: Measure reduction in time spent matching CRM records to Zoho Books
- **User Adoption Rate**: Track percentage of invoices and DC bills with assigned reference numbers
- **Error Reduction**: Monitor decrease in duplicate reference number incidents
- **Search Usage**: Track frequency of reference number-based searches

### 8.2 User Experience Metrics
- **Feature Utilization**: Measure daily/weekly usage of reference number functionality
- **Error Rate**: Track frequency of validation errors and user corrections
- **Time to Assignment**: Measure average time from record creation to reference number assignment
- **User Satisfaction**: Survey feedback on ease of use and workflow integration

### 8.3 Data Quality Metrics
- **Reference Number Coverage**: Percentage of eligible records with assigned reference numbers
- **Audit Trail Completeness**: Verification that all changes are properly logged
- **Data Integrity**: Confirmation of zero duplicate reference numbers system-wide
- **Reconciliation Accuracy**: Measure improvement in CRM-to-Zoho Books matching accuracy

---

## 9. Dependencies and Assumptions

### 9.1 System Dependencies
- MyHealthMeter CRM Accounting Module must be fully operational
- User authentication and authorization system must be in place
- Audit logging infrastructure must be available
- Search and filter framework must support new field types

### 9.2 Business Process Dependencies
- Zoho Books integration workflow must be defined
- User training on reference number assignment must be completed
- Reconciliation procedures must be updated to incorporate reference numbers
- Data migration plan for existing records must be established

### 9.3 Key Assumptions
- Users will consistently assign reference numbers for improved reconciliation
- Zoho Books reference number format will remain stable
- System performance will not be significantly impacted by uniqueness validation
- Users have appropriate permissions for their role-based access needs