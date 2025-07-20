# Master Data Management Screens PRD

**Project:** MyHealthMeter CRM – Master Data Read-Only Screens  
**Author:** Product Team  
**Date:** July 18, 2025

---

## Overview

This PRD defines read-only master data management screens for the MyHealthMeter CRM Accounting Module. All screens display existing data without edit capabilities and include proper navigation and relationships between entities.

---

## Screen Navigation Structure

```
Master Data (Main Menu)
├── Corporates
├── Diagnostic Centers
├── Locations
├── Services & Packages
├── Purchase Orders
├── HR Contacts
├── Additional Tests
└── Company Information
```

---

## Screen Specifications

### 1. Master Data Landing Page

**Route:** `/master-data`

**Layout:**
- Page title: "Master Data Management"
- Grid of cards (3 columns, responsive)
- Each card represents a master data entity
- Card contains icon, title, description, and record count

**Cards:**
1. **Corporates** - "View corporate clients and their details" - Shows total count
2. **Diagnostic Centers** - "Manage healthcare service providers" - Shows total count  
3. **Locations** - "Service delivery locations" - Shows total count
4. **Services & Packages** - "Health checkup packages and rates" - Shows total count
5. **Purchase Orders** - "Corporate purchase orders" - Shows active PO count
6. **HR Contacts** - "Corporate HR personnel" - Shows total count
7. **Additional Tests** - "Supplementary medical tests" - Shows total count
8. **Company Information** - "MyHealthMeter company details" - Single record

**Navigation:** Click any card to navigate to respective entity screen

---

### 2. Corporates Screen

**Route:** `/master-data/corporates`

**Header:**
- Breadcrumb: Master Data > Corporates
- Page title: "Corporate Clients"
- Total count: "Total Corporates: X"

**Filters:**
- Search box: "Search by name, code, or GSTIN"
- Status filter: All | Active | Inactive
- State filter: Dropdown with all states

**Data Table Columns:**
| Column | Data Type | Description |
|--------|-----------|-------------|
| Corporate Code | Text | Short identifier |
| Corporate Name | Text | Full legal name (clickable) |
| GSTIN/UIN | Text | GST identification |
| State | Text | State name and code |
| Status | Badge | Active/Inactive with color coding |
| Contact Person | Text | Primary contact |
| Contract Period | Text | Start - End date |
| Actions | Icon | View details button |

**Table Features:**
- Sorting on all columns
- Pagination (50 records per page)
- Export to CSV

**Row Click Action:** Navigate to Corporate Details screen

**Relationships:**
- Links to related Entities, HR Contacts, Purchase Orders

---

### 3. Corporate Details Screen

**Route:** `/master-data/corporates/{corporate-id}`

**Header:**
- Breadcrumb: Master Data > Corporates > {Corporate Name}
- Page title: Corporate name
- Status badge

**Information Sections:**

**Basic Information:**
- Corporate ID, Name, Code
- GSTIN/UIN, PAN Number
- Registration Address, Billing Address
- State, Contact Person, Email, Phone
- Contract dates, Payment terms, Status

**Related Data Tabs:**
1. **Entities** - List of business units under this corporate
2. **HR Contacts** - HR personnel for this corporate  
3. **Purchase Orders** - POs issued by this corporate
4. **Locations** - Service locations used by this corporate

**Each tab shows:**
- Summary count
- Mini table with key columns
- "View All" button to navigate to filtered view of related entity

---

### 4. Diagnostic Centers Screen

**Route:** `/master-data/diagnostic-centers`

**Header:**
- Breadcrumb: Master Data > Diagnostic Centers
- Page title: "Diagnostic Centers"
- Total count: "Total DCs: X"

**Filters:**
- Search box: "Search by name, code, or location"
- Status filter: All | Active | Inactive
- Service type filter: AHC | PEC | OPD | All
- State filter: Dropdown

**Data Table Columns:**
| Column | Data Type | Description |
|--------|-----------|-------------|
| DC Code | Text | Short identifier |
| DC Name | Text | Full name (clickable) |
| Primary Location | Text | Main service location |
| Service Types | Pills | AHC, PEC, OPD badges |
| Contact Person | Text | DC point of contact |
| Status | Badge | Active/Inactive |
| Child DCs | Number | Count of associated centers |
| Actions | Icon | View details button |

**Relationships:**
- Links to Locations, Child DCs

---

### 5. DC Details Screen

**Route:** `/master-data/diagnostic-centers/{dc-id}`

**Header:**
- Breadcrumb: Master Data > Diagnostic Centers > {DC Name}
- Page title: DC name
- Status badge

**Information Sections:**

**Basic Information:**
- DC ID, Name, Code, Address
- Contact details, GSTIN, PAN
- Service types, Capacity, Operating hours
- Payment terms, Rate card details

**Related Data Tabs:**
1. **Locations** - Service locations for this DC
2. **Child DCs** - Associated smaller centers
3. **Rate Card** - Service pricing structure

---

### 6. Locations Screen

**Route:** `/master-data/locations`

**Header:**
- Breadcrumb: Master Data > Locations
- Page title: "Service Locations"
- Total count: "Total Locations: X"

**Filters:**
- Search box: "Search by name, city, or area"
- Diagnostic Center filter: Dropdown with all DCs
- State filter: Dropdown
- Status filter: All | Active | Inactive

**Data Table Columns:**
| Column | Data Type | Description |
|--------|-----------|-------------|
| Location Code | Text | Short identifier |
| Location Name | Text | Full name (clickable) |
| City | Text | City name |
| Area/Zone | Text | Specific area |
| Diagnostic Center | Text | Associated DC (clickable) |
| Service Types | Pills | Available services |
| Status | Badge | Active/Inactive |
| Actions | Icon | View details button |

**Relationships:**
- Parent-child relationship with Diagnostic Centers
- Click DC name to navigate to DC details

---

### 7. Services & Packages Screen

**Route:** `/master-data/services`

**Header:**
- Breadcrumb: Master Data > Services & Packages
- Page title: "Health Services & Packages"
- Total count: "Total Services: X"

**Filters:**
- Search box: "Search by name or code"
- Service type filter: AHC | PEC | OPD | Additional Tests
- Package category filter: Standard | Premium | Executive | All

**Data Table Columns:**
| Column | Data Type | Description |
|--------|-----------|-------------|
| Service Code | Text | Short identifier |
| Service Name | Text | Full name (clickable) |
| Service Type | Badge | AHC/PEC/OPD |
| Package Category | Text | Standard/Premium/Executive |
| Base Rate | Currency | Standard pricing |
| GST Rate | Percentage | Tax percentage |
| HSN/SAC Code | Text | Tax classification |
| Actions | Icon | View details button |

---

### 8. Service Details Screen

**Route:** `/master-data/services/{service-id}`

**Header:**
- Breadcrumb: Master Data > Services & Packages > {Service Name}
- Page title: Service name
- Service type badge

**Information Sections:**

**Basic Information:**
- Service ID, Code, Name, Type
- Package category, Target demographics
- Rates, GST rate, HSN/SAC code
- Duration, Prerequisites

**Service Details:**
- Inclusions (list)
- Exclusions (list)
- Special instructions
- Report delivery timeframe

---

### 9. Purchase Orders Screen

**Route:** `/master-data/purchase-orders`

**Header:**
- Breadcrumb: Master Data > Purchase Orders
- Page title: "Purchase Orders"
- Total count: "Total POs: X"

**Filters:**
- Search box: "Search by PO number or corporate"
- Corporate filter: Dropdown with all corporates
- Status filter: Active | Expired | Closed | All
- Date range filter: PO Date from/to

**Data Table Columns:**
| Column | Data Type | Description |
|--------|-----------|-------------|
| PO Number | Text | Unique identifier (clickable) |
| Corporate | Text | Issuing corporate (clickable) |
| PO Date | Date | Issue date |
| PO Value | Currency | Total authorized amount |
| Balance Amount | Currency | Remaining amount |
| Validity Period | Date Range | Start - End dates |
| Status | Badge | Active/Expired/Closed |
| Actions | Icon | View details button |

**Relationships:**
- Click Corporate name to navigate to Corporate details

---

### 10. PO Details Screen

**Route:** `/master-data/purchase-orders/{po-id}`

**Header:**
- Breadcrumb: Master Data > Purchase Orders > {PO Number}
- Page title: PO Number
- Status badge

**Information Sections:**

**Basic Information:**
- PO Number, Corporate, Entity
- PO Date, Value, Balance Amount
- Validity period, Payment terms
- Status, Approval authority

**Service Coverage:**
- Service types covered
- Employee coverage count
- Rate structure details
- Special terms

**Utilization History:**
- Previous usage tracking
- Invoice references
- Balance changes over time

---

### 11. HR Contacts Screen

**Route:** `/master-data/hr-contacts`

**Header:**
- Breadcrumb: Master Data > HR Contacts
- Page title: "HR Contacts"
- Total count: "Total Contacts: X"

**Filters:**
- Search box: "Search by name, email, or corporate"
- Corporate filter: Dropdown with all corporates
- Status filter: Active | Inactive | All
- Responsibility filter: AHC | PEC | OPD | All

**Data Table Columns:**
| Column | Data Type | Description |
|--------|-----------|-------------|
| Contact Name | Text | Full name (clickable) |
| Corporate | Text | Associated corporate (clickable) |
| Designation | Text | HR role/title |
| Email | Text | Business email |
| Mobile | Text | Contact number |
| Responsibilities | Pills | AHC, PEC, OPD badges |
| Status | Badge | Active/Inactive |
| Actions | Icon | View details button |

**Relationships:**
- Click Corporate name to navigate to Corporate details

---

### 12. Additional Tests Screen

**Route:** `/master-data/additional-tests`

**Header:**
- Breadcrumb: Master Data > Additional Tests
- Page title: "Additional Medical Tests"
- Total count: "Total Tests: X"

**Filters:**
- Search box: "Search by test name or code"
- Category filter: Blood | Imaging | Cardiac | Other | All
- Sample type filter: Blood | Urine | Other | All
- Fasting required filter: Yes | No | All

**Data Table Columns:**
| Column | Data Type | Description |
|--------|-----------|-------------|
| Test Code | Text | Short identifier |
| Test Name | Text | Full name (clickable) |
| Category | Badge | Blood/Imaging/Cardiac/Other |
| Rate | Currency | Standard pricing |
| Sample Type | Text | Blood/Urine/Other |
| Fasting Required | Badge | Yes/No |
| Report Time | Text | Delivery timeframe |
| Actions | Icon | View details button |

---

### 13. Company Information Screen

**Route:** `/master-data/company`

**Header:**
- Breadcrumb: Master Data > Company Information
- Page title: "Company Information"
- Last updated timestamp

**Information Sections:**

**Company Details:**
- Company Name, Registered Address
- GSTIN/UIN, PAN, CIN
- State Code, UDYAM Registration
- Email, Phone

**Bank Details:**
- Account Holder Name
- Bank Name, Account Number
- IFSC Code, Branch details

**Legal Information:**
- Company logo preview
- Digital signature details
- Legal declarations
- MSME registration

**Invoice Settings:**
- Default invoice terms
- Payment terms
- Legal disclaimers

---

## Common Screen Features

### Navigation
- Consistent breadcrumb navigation
- Back button functionality
- Main menu access from all screens

### Data Display
- Consistent table styling and pagination
- Search functionality on all list screens
- Export to CSV on all list screens
- Responsive design for all screen sizes

### Relationships
- Clickable references between related entities
- Filtered views when navigating from related data
- Clear parent-child relationships maintained

### Error Handling
- Graceful handling of missing data
- Clear error messages for failed data loads
- Loading states for all data fetching operations

### Accessibility
- Keyboard navigation support
- Screen reader friendly markup
- Proper color contrast ratios
- Clear focus indicators

---

This PRD provides comprehensive specifications for read-only master data screens with proper relationships and navigation flow suitable for implementation with Claude Code.