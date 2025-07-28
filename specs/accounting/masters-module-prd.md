# Product Requirements Document (PRD)

**Project:** MyHealthMeter CRM – Accounting Masters Module  
**Version:** 1.0  
**Date:** July 25, 2025  
**Document Status:** Final  

---

## Executive Summary

This document defines the product requirements for the Masters module within the MyHealthMeter CRM Accounting system. Based on the Accounting Module FRD v7.0 and actual invoice data patterns, the Masters module provides a read-only view of reference data used in the accounting operations. The module displays data from the existing CRM database for Corporates, Entities, Locations, Service Types, and HR Contacts. All master data management remains external to this system, with this module serving as a viewing interface only.

---

## 1. Product Overview

### 1.1 Objectives
- Provide centralized read-only view of master data used in accounting workflows
- Enable efficient search and filtering of master entities
- Display master data from existing CRM database
- Support the invoice generation and DC bill workflows with reference data
- Ensure seamless integration with current UI/UX design patterns

### 1.2 Scope
**In Scope:**
- Read-only display of five master entities:
  - Corporates
  - Entities
  - Locations
  - Service Types
  - HR Contacts
- Search and filtering capabilities
- Export functionality for all masters
- Integration with existing accounting workflows

**Out of Scope:**
- Any CRUD (Create, Read, Update, Delete) operations
- Zoho Books synchronization (as per FRD: "Master data screens not developed in Phase 1")
- Real-time data updates
- Data validation or business rules
- Activity logging (no changes to log)

### 1.3 Success Metrics
- 100% alignment with existing UI patterns
- Sub-2 second page load times
- Seamless integration with Receivables and DC Bills workflows

---

## 2. User Context

### 2.1 User Stories
- As a Finance User, I want to view corporate details so that I can verify invoice information
- As a Finance User, I want to search entities so that I can understand corporate structure
- As a Finance User, I want to view locations so that I can verify service delivery areas
- As a Finance User, I want to see service types so that I understand billing categories
- As a Finance User, I want to view HR contacts so that I can identify the right person for billing queries

### 2.2 System Context
Per the FRD v7.0:
- "Master data screens not developed in Phase 1"
- "Dropdowns populated from current CRM database values"
- The Masters tab serves as a reference-only interface
- All data management happens outside this system

---

## 3. Functional Requirements

### 3.1 Masters Tab Structure

The Masters tab will contain five sub-tabs:
1. **Corporates** - Parent company organizations
2. **Entities** - Divisions/subsidiaries within corporates
3. **Locations** - Branches/offices within entities
4. **Service Types** - Health checkup categories
5. **HR Contacts** - Human Resources personnel mapped at Corp/Entity/Location levels

**Data Hierarchy:**
```
Corporate
  └── Entity 1
        ├── Location 1.1
        ├── Location 1.2
        └── Location 1.3
  └── Entity 2
        ├── Location 2.1
        └── Location 2.2

HR Contacts can be mapped at any level
```

### 3.2 Common Features Across All Masters

#### 3.2.1 Page Header
- **Info Banner**: Blue background (#E3F2FD) with info icon (ℹ️)
- **Message**: "Master data is view-only. Changes must be made in the source system."

#### 3.2.2 List View Layout
- **Search Bar**: Full-width search with magnifying glass icon
- **Filters**: Relevant filters below search bar
- **Export**: "Export CSV" link in top-right corner
- **Total Count**: "Showing X of Y [entity type]"
- **No Add/Edit/Delete buttons** (read-only interface)

#### 3.2.3 Table Design
- Header row with gray background (#F5F5F5)
- Alternating row colors (white and #FAFAFA)
- Sortable columns with arrow indicators
- View action button (👁️) in rightmost column
- Hover effect on rows
- Responsive with horizontal scroll

### 3.3 Corporate Master

#### 3.3.1 List View Columns
Based on invoice data:
- Corporate Name
- Corporate Code (e.g., AHFL)
- GSTIN
- PAN Number
- State
- City
- Active Employees (count)
- Status (Active/Inactive badge)
- Actions (View only)

#### 3.3.2 Search & Filter
- Search: By corporate name, code, GSTIN, PAN
- Filter: 
  - State (dropdown)
  - City (dropdown)
  - Status (All/Active/Inactive)

#### 3.3.3 View Modal Fields
- **Basic Information**:
  - Corporate Name
  - Corporate Code
  - Legal Name (as per GSTIN)
- **Tax Information**:
  - GSTIN/UIN
  - PAN Number
  - State Name & Code
  - Tax Registration Type
- **Address Details**:
  - Registered Address
  - Billing Address (if different)
  - City
  - State
  - Pincode
- **Contact Information**:
  - Primary Contact Person
  - Contact Email
  - Contact Phone
  - Accounts Email
- **Payment Terms**:
  - Default Payment Terms (e.g., 30 Days)
  - Credit Limit
  - Currency
- **System Information**:
  - Status
  - Created Date
  - Last Modified Date

### 3.4 Entity Master

#### 3.4.1 List View Columns
Based on invoice and business structure:
- Entity Name
- Entity Code
- Corporate Name (parent)
- GSTIN (if separate)
- Number of Locations
- Number of Employees
- Status (Active/Inactive badge)
- Actions (View only)

#### 3.4.2 Search & Filter
- Search: By entity name, code, or GSTIN
- Filter: 
  - Corporate (dropdown)
  - Has Separate GSTIN (Yes/No)
  - Status (All/Active/Inactive)

#### 3.4.3 View Modal Fields
- **Entity Information**:
  - Entity Name
  - Entity Code
  - Legal Entity Name
  - Entity Type (Division/Subsidiary/Unit)
- **Parent Information**:
  - Parent Corporate Name & Code
  - Relationship Type
- **Tax Information**:
  - GSTIN (if separate from corporate)
  - PAN (if separate)
  - State Code
  - Tax Registration Status
- **Address Details**:
  - Registered Address (if different from corporate)
  - Communication Address
- **Operational Details**:
  - Number of Locations/Branches
  - Total Employees
  - Business Vertical
- **System Information**:
  - Status
  - Created Date
  - Last Modified Date

### 3.5 Location Master

#### 3.5.1 List View Columns
Based on employee location data from invoice:
- Location Name (Branch Name)
- Location Code
- Entity Name (parent)
- Corporate Name (grandparent)
- City
- State
- Number of Employees
- Status (Active/Inactive badge)
- Actions (View only)

#### 3.5.2 Search & Filter
- Search: By location name, code, or city
- Filter: 
  - Corporate (dropdown)
  - Entity (dropdown, filtered by selected corporate)
  - State (dropdown - e.g., Maharashtra, Gujarat, Madhya Pradesh, etc.)
  - City (dropdown)
  - Status (All/Active/Inactive)

#### 3.5.3 View Modal Fields
- **Location Information**:
  - Location Name
  - Location Code
  - Branch Type (Head Office/Branch/Regional Office)
- **Hierarchy**:
  - Parent Entity Name & Code
  - Parent Corporate Name & Code
- **Address Details**:
  - Complete Address
  - City
  - State
  - Pincode
  - Landmark
- **Contact Details**:
  - Location Phone
  - Location Email
  - Branch Manager Name
- **Operational Details**:
  - Number of Employees
  - Operational Since
  - Working Hours
- **System Information**:
  - Status
  - Created Date
  - Last Modified Date

### 3.6 Service Type Master

#### 3.6.1 List View Columns
Based on invoice service data:
- Service Name (e.g., "Health Checkup Male Plan (<35)")
- Service Code
- Category (Sr. Management/Male/Female)
- Age Group (e.g., <35, 35-45, 45+)
- HSN/SAC Code
- Base Rate (₹)
- Status (Active/Inactive badge)
- Actions (View only)

#### 3.6.2 Search & Filter
- Search: By service name, code, or HSN/SAC
- Filter: 
  - Category (Sr. Management/Regular)
  - Gender (Male/Female/Unisex)
  - Age Group (<35/35-45/45+)
  - Status (All/Active/Inactive)

#### 3.6.3 View Modal Fields
- **Service Information**:
  - Service Name
  - Service Code
  - Service Category
  - Plan Type (Male/Female/Unisex)
  - Age Group
  - Description
- **Pricing Details**:
  - HSN/SAC Code (e.g., 999316)
  - Base Rate
  - Unit of Measure (Nos)
  - GST Rate (if applicable)
  - Total Rate (with GST)
- **Package Details** (if applicable):
  - Tests Included
  - Additional Services
  - Exclusions
- **System Information**:
  - Status
  - Effective From Date
  - Effective To Date
  - Created Date
  - Last Modified Date

### 3.7 HR Contact Master

#### 3.7.1 List View Columns
- HR Name
- Email
- Phone
- Designation
- Mapped To (Corporate/Entity/Location name)
- Mapping Level (Corp/Entity/Location badge)
- Department
- Status (Active/Inactive badge)
- Actions (View only)

#### 3.7.2 Search & Filter
- Search: By HR name, email, or phone
- Filter: 
  - Mapping Level (All/Corporate/Entity/Location)
  - Corporate (dropdown)
  - Entity (dropdown, filtered by selected corporate)
  - Location (dropdown, filtered by selected entity)
  - Department (dropdown)
  - Status (All/Active/Inactive)

#### 3.7.3 View Modal Fields
- **Personal Information**:
  - Full Name
  - Employee ID
  - Designation
  - Department
  - Email (primary)
  - Alternate Email
  - Phone (primary)
  - Mobile
  - Alternate Phone
- **Mapping Details**:
  - Mapping Level (Corporate/Entity/Location)
  - Mapped Corporate Name
  - Mapped Entity Name (if applicable)
  - Mapped Location Name (if applicable)
  - Coverage Area (e.g., "All Mumbai Locations", "Western Region")
- **Contact Preferences**:
  - Preferred Contact Method
  - Best Time to Contact
  - Language Preference
  - Time Zone
- **Role Information**:
  - HR Function (Benefits/Payroll/General/Approvals)
  - Authorization Level
  - Approval Limits (if applicable)
  - Special Permissions
- **System Information**:
  - Status
  - Created Date
  - Last Modified Date
  - Last Login Date

#### 3.7.4 Special Display Rules
- **Corporate-level HR**: Show with blue "CORP" badge
- **Entity-level HR**: Show with green "ENTITY" badge  
- **Location-level HR**: Show with orange "LOCATION" badge
- **Multiple HR at same level**: List all with clear differentiation by department/function

---

## 4. UI/UX Specifications

### 4.1 Design Consistency
Following the existing accounting module patterns:

#### 4.1.1 Colors
- **Primary Action**: #4CAF50 (Green) - for Search button
- **Info Banner**: #E3F2FD (Light blue background)
- **Table Headers**: #F5F5F5 (Light gray)
- **Borders**: #E0E0E0
- **Link Text**: #2196F3 (Blue)

#### 4.1.2 Components
- **Dropdowns**: Placeholder format "All [Entity] (Optional)" or "Select [Entity]"
- **Search**: Debounce 300ms, minimum 2 characters
- **Tables**: 48px row height, 16px horizontal padding
- **Modals**: 60% viewport width, max 800px

#### 4.1.3 Icons
- View: 👁️
- Export: Standard download icon
- Info: ℹ️ (for banner)

### 4.2 Empty States
- **No Data**: "No [entity type] found in the system."
- **No Search Results**: "No [entity type] match your search criteria."
- **No Filter Results**: "No [entity type] match the selected filters."

### 4.3 Loading States
- Table skeleton loader while fetching data
- Maintain layout structure during load

---

## 5. Integration Requirements

### 5.1 Data Source
Per FRD v7.0:
- "Existing data in new CRM database"
- "System operates on current data snapshot"
- "Dropdowns populated from current CRM database values"

### 5.2 Integration Points
- **Receivables Module**: 
  - Uses Corporate dropdown for invoice generation
  - Uses Entity dropdown (filtered by Corporate)
  - Uses Location dropdown (filtered by Entity)
  - Uses Service Type for categorization
  - References appropriate HR contacts based on hierarchy
- **DC Bills Module**: 
  - Uses Location dropdown for DC branch locations
  - Maps to Entity and Corporate for billing hierarchy
- **Invoice Communication**:
  - Identifies correct HR contact at appropriate level
  - Falls back to higher level HR if no local HR exists
- **Hierarchical Filtering**:
  - Corporate selection filters available Entities
  - Entity selection filters available Locations
  - HR contacts shown based on selected level

### 5.3 Technical Specifications
- Data fetched from existing CRM tables
- No real-time synchronization required
- Page refresh to see latest data

---

## 6. Export Functionality

### 6.1 CSV Export
- **Trigger**: Click "Export CSV" link
- **Filename**: `[EntityType]_Masters_[DD-MM-YYYY].csv`
- **Encoding**: UTF-8 with BOM
- **Contents**: All columns visible in table
- **Empty State**: Export disabled if no data

### 6.2 Export Limits
- Maximum 50,000 records per export
- No pagination in export (all matching records)

---

## 7. Performance Requirements

### 7.1 Response Times
- Page Load: < 2 seconds
- Search Results: < 500ms
- Filter Application: < 300ms
- Export Generation: < 5 seconds

### 7.2 Data Handling
- Pagination: 25 records per page
- Client-side search on loaded data
- Server-side filtering for large datasets

---

## 8. Error Handling

### 8.1 Error Messages
- **Data Load Failure**: "Unable to load [entity type]. Please refresh the page."
- **Export Failure**: "Export failed. Please try again."
- **No Connection**: "Please check your internet connection and try again."

### 8.2 Graceful Degradation
- Show cached data if available
- Maintain UI structure even with errors
- Clear error indication to users

---

## 9. Acceptance Criteria

### 9.1 Functional Criteria
- All five master entities display correctly
- Search returns accurate results
- Filters work as specified
- Export produces valid CSV files
- View modals display all data fields
- HR contact filtering by corporate/entity works correctly

### 9.2 UI/UX Criteria
- Matches existing Receivables and DC Bills design
- Responsive on all screen sizes
- Clear read-only indication
- No visual inconsistencies

### 9.3 Integration Criteria
- Dropdowns in other modules populate correctly
- No impact on existing workflows
- Data consistency across modules

---

## 10. Future Considerations (Out of Scope)

As mentioned in FRD v7.0, these are not in Phase 1:
- Zoho Books API integration
- Master data synchronization screens
- CRUD operations
- Real-time updates

---

## 11. Data Relationships

### 11.1 Hierarchical Structure
```
Corporate (Parent)
  │
  ├─→ Multiple Entities (Children)
  │     │
  │     └─→ Multiple Locations (Grandchildren)
  │
  └─→ HR Contacts (can be mapped here)
        │
        ├─→ HR Contacts (can be mapped at Entity level)
        │
        └─→ HR Contacts (can be mapped at Location level)
```

### 11.2 HR Contact Mapping Rules
- **Corporate-level HR**: Has visibility and authority over all entities and locations under that corporate
- **Entity-level HR**: Has visibility and authority over all locations under that entity
- **Location-level HR**: Has visibility and authority only for that specific location
- **Multiple HR**: Same level can have multiple HR contacts with different functions (Benefits, Payroll, Approvals)
- **Fallback Hierarchy**: If no HR at Location level, system shows Entity-level HR; if no Entity-level, shows Corporate-level HR

---

## Appendix A: References

Based on:
- **MyHealthMeter CRM - Accounting Module FRD v7.0** which specifies:
  - "Master data screens not developed in Phase 1"
  - "Dropdowns populated from current CRM database values"
  - References to Corporate, Entity, Location, and Service Type in the Receivables workflow
- **Sample Invoice Data** showing actual field usage:
  - Corporate structure (e.g., Aadhar Housing Finance Limited with code AHFL)
  - Service types with age-based categorization
  - Employee location distribution across states
  - HSN/SAC codes for services

**HR Contact Master Addition Rationale:**
- Essential for invoice delivery and billing communications
- Required for escalation management
- Needed for authorization and approval workflows
- Common in healthcare CRM systems for corporate account management

## Appendix B: Sample Data Patterns

Based on the invoice analysis:
- **States covered**: Maharashtra, Gujarat, Madhya Pradesh, West Bengal, Uttar Pradesh, Rajasthan, Delhi/NCR, Chhattisgarh
- **Service Categories**: Sr. Management Plans, Age-based Plans (<35, 35-45, 45+), Gender-specific Plans
- **HSN/SAC Code**: 999316 (Health services)
- **Employee Distribution**: Shows employees spread across multiple states under single corporate