# Product Requirements Document (PRD)
## Employees Section - MyHealthMeter CRM Accounting Module

**Version:** 1.0  
**Date:** July 25, 2025  
**Status:** Ready for Development

---

## 1. Overview

### 1.1 Purpose
Add an "Employees" tab to the existing Accounting Module that enables the accounting team to view employee appointment history and financial reconciliation data on a per-corporate basis.

### 1.2 Context
- The Accounting Module already has three tabs: Invoices (Receivables), DC Bills (Payables), and Masters
- This will be the fourth tab in the module
- All appointment, invoice, and DC bill data already exists in the system

### 1.3 Key Objectives
- View all employees (active/inactive) for a selected corporate
- Drill down to individual employee appointment history
- Cross-reference appointments with invoices and DC bills via Zoho IDs
- Enable cross-corporate search by Zoho reference numbers

---

## 2. User Stories

### 2.1 As an accounting team member:
- I want to select a corporate and see all their employees
- I want to view detailed appointment history for any employee
- I want to see which appointments are invoiced or have DC bills
- I want to search for appointments using Zoho reference numbers
- I want to navigate directly to related invoices or DC bills

---

## 3. Functional Requirements

### 3.1 Navigation
- Add "Employees" as the fourth tab in the Accounting Module
- Tab should be accessible to all accounting roles

### 3.2 Employee Listing Screen

#### 3.2.1 Layout Structure
```
[Zoho ID Search Bar]
[Corporate Dropdown]
[Filters Panel]
[Employee Grid]
[Pagination]
```

#### 3.2.2 Corporate Selection
- **Type**: Searchable dropdown
- **Data**: All corporates from master data
- **Behavior**: 
  - On selection, load employees for that corporate
  - No persistence between sessions
  - Ajax refresh (no page reload)

#### 3.2.3 Employee Grid Columns
| Column | Type | Sortable | Filterable | Notes |
|--------|------|----------|------------|--------|
| Emp ID | String | Yes | Yes (search) | Primary identifier |
| Name | String | Yes | Yes (search) | Employee full name |
| Email | String | Yes | Yes (search) | Employee email |
| Mobile | String | No | No | Contact number |
| AHC Benefit Status | Enum | Yes | Yes | Active/Inactive |
| Benefit Source | String | No | Yes | Source of benefit |
| Next AHC Date | Date | Yes | Yes (range) | Upcoming AHC date |
| Last AHC Date | Date | Yes | Yes (range) | Previous AHC date |
| Designation | String | Yes | Yes | Current designation |
| Location | String | Yes | Yes | Work location |
| Passcode Status | Enum | No | Yes | Status of passcode |
| Employee Status | Enum | Yes | Yes | Active/Inactive/Terminated |
| Actions | Button | No | No | "View" button only |

#### 3.2.4 Filters
- **Employee Status**: Multi-select (Active/Inactive/Terminated) - Default: All
- **AHC Benefit Status**: Multi-select dropdown
- **Benefit Source**: Multi-select dropdown
- **Location**: Multi-select with search
- **Designation**: Multi-select with search
- **Passcode Status**: Multi-select
- **Next AHC Date**: Date range picker
- **Last AHC Date**: Date range picker
- **Search**: Free text (searches Name, Email, Emp ID)

#### 3.2.5 Grid Features
- **Pagination**: 25/50/100 records per page
- **Sorting**: Click column header to toggle ASC/DESC
- **Export**: "Export to Excel" button (exports current filtered view)
- **Loading**: Show spinner during data fetch

### 3.3 Employee Appointment History

#### 3.3.1 Navigation Flow
- Click "View" button → Grid refreshes to show appointments
- Breadcrumb: `Accounting > Employees > [Corporate Name] > [Employee Name - ID]`
- "Back" button returns to employee listing

#### 3.3.2 Appointment Grid Columns
| Column | Type | Sortable | Links To | Format/Notes |
|--------|------|----------|----------|--------------|
| Appointment ID | String | Yes | - | Appointment identifier |
| Self/Dependent | String | Yes | - | "Self" or dependent name |
| Designation | String | Yes | - | At time of appointment |
| Requested Date | Date | Yes | - | DD/MM/YYYY |
| Appointment Date | Date | Yes | - | DD/MM/YYYY |
| Medical Done Date | Date | Yes | - | DD/MM/YYYY |
| Corporate Plan Details | String | No | - | e.g., "AHFL - Male below 35" |
| Additional Paid Tests | String | No | - | "Test1 (₹500), Test2 (₹300)" |
| Center Details | String | Yes | - | "Center Name - Location" |
| DC Rate | Number | Yes | - | ₹ format |
| Invoice Number | String | Yes | Invoice Tab | Hyperlink if exists |
| Invoice Status | Enum | Yes | - | Draft/Submitted/Approved/- |
| Zoho ID (Invoice) | String | Yes | Modal | Hyperlink if exists |
| DC Bill Docket ID | String | Yes | DC Bills Tab | Hyperlink if exists |
| DC Bill Status | Enum | Yes | - | Draft/Submitted/Approved/- |
| Zoho ID (DC Bill) | String | Yes | Modal | Hyperlink if exists |

#### 3.3.3 Appointment Filters
- **Date Range**: For appointment date (from/to)
- **Invoice Status**: Dropdown (All/Draft/Submitted/Approved/Not Created)
- **DC Bill Status**: Dropdown (All/Draft/Submitted/Approved/Not Created)
- **Center**: Multi-select dropdown of all centers
- **Self/Dependent**: Radio buttons (All/Self/Dependent)
- **Zoho ID**: Text search for invoice or DC bill Zoho ID

#### 3.3.4 Additional Features
- **Summary Row**: Show total DC amount at bottom
- **Export**: Export current view to Excel
- **Only show**: Medical Done appointments

### 3.4 Zoho Reference Modal

#### 3.4.1 Trigger
- Click on any Zoho ID in appointment grid

#### 3.4.2 Modal Specifications
- **Title**: "Zoho Reference: [ID] - Appointments"
- **Size**: Large modal (80% width)
- **Close**: X button and ESC key

#### 3.4.3 Modal Grid
| Column | Type | Sortable |
|--------|------|----------|
| Employee Name | String | Yes |
| Employee ID | String | Yes |
| Corporate | String | Yes |
| Date | Date | Yes |
| Rate (₹) | Number | Yes |
| Service Type | String | Yes |

#### 3.4.4 Modal Features
- Show all appointments under the Zoho reference
- Display total amount at bottom
- No pagination (show all records)
- No export functionality

### 3.5 Zoho ID Search

#### 3.5.1 Search Bar
- **Location**: Above corporate dropdown
- **Placeholder**: "Search by Zoho ID"
- **Behavior**: 
  - When searching, disable corporate dropdown
  - Clear search to return to normal mode

#### 3.5.2 Search Results
- Use same grid structure as Zoho Reference Modal
- Show all matching appointments across all corporates
- Employee Name is clickable → navigates to their appointment history
- Show "No results found" if no matches

### 3.6 Cross-Module Navigation

#### 3.6.1 To Invoices Tab
- Click Invoice Number → Navigate to Invoices tab
- URL: `/accounting/invoices?highlight=[INVOICE_ID]`
- Invoice should be highlighted/selected in the list

#### 3.6.2 To DC Bills Tab
- Click DC Bill Docket ID → Navigate to DC Bills tab
- URL: `/accounting/dc-bills?highlight=[DOCKET_ID]`
- Docket should be highlighted/selected in the list

---

## 4. Technical Specifications

### 4.1 Routes
```
/accounting/employees                          - Main employee listing
/accounting/employees?corporate=[ID]           - With pre-selected corporate
/accounting/employees/[EMP_ID]                - Employee appointment history
/accounting/employees?zoho=[ID]               - Zoho ID search results
```

### 4.2 Data Requirements

#### 4.2.1 Employee Listing Data
```javascript
{
  employees: [
    {
      emp_id: string,
      name: string,
      email: string,
      mobile: string,
      ahc_benefit_status: "Active" | "Inactive",
      benefit_source: string,
      next_ahc_date: date | null,
      last_ahc_date: date | null,
      designation: string,
      location: string,
      passcode_status: string,
      employee_status: "Active" | "Inactive" | "Terminated"
    }
  ],
  total_count: number,
  page: number,
  page_size: number
}
```

#### 4.2.2 Appointment History Data
```javascript
{
  employee: {
    id: string,
    name: string,
    corporate_name: string
  },
  appointments: [
    {
      appointment_id: string,
      is_dependent: boolean,
      dependent_name: string | null,
      designation_at_appointment: string,
      requested_date: date,
      appointment_date: date,
      medical_done_date: date,
      corporate_plan_details: string,
      additional_tests: [
        {
          name: string,
          amount: number
        }
      ],
      center: {
        name: string,
        location: string
      },
      dc_rate: number,
      invoice: {
        number: string | null,
        status: "Draft" | "Submitted" | "Approved" | null,
        zoho_id: string | null
      },
      dc_bill: {
        docket_id: string | null,
        status: "Draft" | "Submitted" | "Approved" | null,
        zoho_id: string | null
      }
    }
  ],
  total_amount: number,
  total_count: number
}
```

### 4.3 API Endpoints Needed

#### 4.3.1 Employee Endpoints
```
GET /api/accounting/employees/list
  Query params:
    - corporate_id: number (required)
    - page: number
    - page_size: number
    - sort_by: string
    - sort_order: "asc" | "desc"
    - filters: JSON object

GET /api/accounting/employees/{emp_id}/appointments
  Query params:
    - page: number
    - page_size: number
    - filters: JSON object

GET /api/accounting/employees/search-by-zoho
  Query params:
    - zoho_id: string (required)
```

#### 4.3.2 Export Endpoints
```
POST /api/accounting/employees/export
  Body: { 
    corporate_id: number,
    filters: object 
  }

POST /api/accounting/employees/{emp_id}/appointments/export
  Body: { 
    filters: object 
  }
```

### 4.4 Filter Objects Structure
```javascript
// Employee Filters
{
  employee_status: string[],
  ahc_benefit_status: string[],
  benefit_source: string[],
  location: string[],
  designation: string[],
  passcode_status: string[],
  next_ahc_date_from: date,
  next_ahc_date_to: date,
  last_ahc_date_from: date,
  last_ahc_date_to: date,
  search_text: string
}

// Appointment Filters
{
  date_from: date,
  date_to: date,
  invoice_status: string,
  dc_bill_status: string,
  center_ids: number[],
  appointment_type: "all" | "self" | "dependent",
  zoho_id_search: string
}
```

### 4.5 State Management
- Use existing state management pattern (Redux/Context)
- Cache corporate list for session
- Don't cache employee or appointment data

### 4.6 Performance Considerations
- Implement virtual scrolling if employee count > 1000
- Lazy load appointment history
- Debounce search inputs (300ms)
- Show loading states during data fetch

---

## 5. UI/UX Specifications

### 5.1 Visual Design
- Follow existing Accounting Module design patterns
- Use same table components as Invoices/DC Bills tabs
- Maintain consistent spacing and typography

### 5.2 Interactive Elements
- **Sorting**: Single column sort at a time
- **Filters**: Apply on button click (not real-time)
- **Search**: Real-time with debounce
- **Loading**: Skeleton screens for initial load, spinners for updates

### 5.3 Responsive Behavior
- Minimum supported width: 1024px
- Tables should have horizontal scroll on smaller screens
- Modal should be full-screen on mobile

### 5.4 Error States
- "No employees found" - When corporate has no employees
- "No appointments found" - When employee has no medical done appointments
- "Invalid Zoho ID" - When Zoho search returns no results
- Network/API errors - Show toast notification with retry option

---

## 6. Audit Logging

### 6.1 Events to Track
```javascript
{
  event_type: "EMPLOYEE_LIST_VIEWED",
  payload: {
    corporate_id: number,
    filters_applied: object
  }
}

{
  event_type: "EMPLOYEE_APPOINTMENT_HISTORY_VIEWED",
  payload: {
    employee_id: string,
    corporate_id: number
  }
}

{
  event_type: "EMPLOYEE_DATA_EXPORTED",
  payload: {
    export_type: "employee_list" | "appointment_history",
    record_count: number,
    filters: object
  }
}

{
  event_type: "ZOHO_ID_SEARCHED",
  payload: {
    zoho_id: string,
    results_count: number
  }
}

{
  event_type: "ZOHO_MODAL_OPENED",
  payload: {
    zoho_id: string,
    source: "invoice" | "dc_bill"
  }
}
```

---

## 7. Testing Scenarios

### 7.1 Functional Tests
1. Corporate selection loads correct employees
2. All filters work independently and in combination
3. Sorting works on all sortable columns
4. Pagination maintains filters and sort
5. Export includes only filtered data
6. Navigation to Invoice/DC Bills tabs works correctly
7. Zoho ID search works across corporates
8. Modal displays correct appointments

### 7.2 Edge Cases
1. Corporate with no employees
2. Employee with no appointments
3. Appointments with no invoice/DC bill
4. Very long employee names/designations
5. Large number of additional tests
6. Invalid Zoho ID search
7. Concurrent filter and sort operations

### 7.3 Performance Tests
1. Load time for 10,000+ employees
2. Search response time
3. Export generation for large datasets
4. Multiple users accessing same corporate data

---

## 8. Dependencies

### 8.1 Existing Systems
- Employee master data from CRM
- Appointment data with medical done status
- Invoice and DC Bill data with Zoho references
- Existing authentication and authorization

### 8.2 Required Integrations
- Existing Invoices tab for navigation
- Existing DC Bills tab for navigation
- Audit logging system
- Export service

---

## 9. Success Metrics

1. **Usage**: Track daily active users of Employees tab
2. **Efficiency**: Time to find specific appointment information
3. **Cross-navigation**: Usage of links to Invoice/DC Bills
4. **Search**: Zoho ID search usage and success rate
5. **Export**: Number of exports generated per week

---

## 10. Future Enhancements (Out of Scope)

1. Bulk operations on appointments
2. Email notifications for pending reconciliations
3. Advanced analytics dashboard
4. API access for external systems
5. Mobile app support

---

## Approval

**Product Owner**: _______________ Date: _______________

**Technical Lead**: _______________ Date: _______________

**Development Team**: _______________ Date: _______________