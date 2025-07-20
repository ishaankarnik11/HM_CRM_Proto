# Product Requirement Document: Eligibility Module - Employee Listing

## 1. Overview

The Employee Listing section within the Eligibility module provides a comprehensive interface for viewing and managing all employees enrolled in the corporate health benefits program. This interface serves as the primary tool for HR administrators to monitor employee eligibility status, manage benefit assignments, and perform bulk operations related to health check benefits.

## 2. User Interface Layout

### 2.1 Page Header
- **Page Title:** "Employee List"
- **Breadcrumb Navigation:** Home > Eligibility Management > Employee List
- **Corporate Context:** Display selected corporate name prominently
- **Total Employee Count:** Display total number of employees in the current view

### 2.2 Filter Section

#### 2.2.1 Global Search
- **Type:** Text input field
- **Placeholder:** "Search by Emp ID, Name, Email, or Mobile"
- **Functionality:** 
  - Real-time search as user types
  - Case-insensitive matching
  - Searches across Employee ID, Name, Email, and Mobile fields
  - Minimum 2 characters required to trigger search
  - Search results highlighted in the table

#### 2.2.2 Status Filters
- **AHC Benefit Status:** Dropdown with multi-select checkboxes
  - Options: Not Booked, Booked, Medical Done
  - Shows count for each status
- **Benefit Source:** Dropdown with multi-select checkboxes
  - Options: Corporate Rule, Benefit Group
  - Dynamically shows actual rule/group names
- **Employee Status:** Radio buttons
  - Options: All, Active, Inactive
- **Passcode Status:** Dropdown with multi-select checkboxes
  - Options: Sent, Delivered, Bounced, Not Sent
- **OPD Benefits:** Radio buttons
  - Options: All, Has OPD Benefits, No OPD Benefits

#### 2.2.3 Eligibility Filter
- **Type:** Toggle switch
- **Label:** "Show Eligible Only"
- **Description:** "Display only employees eligible for AHC today"
- **Functionality:** When enabled, filters to show only employees where Next AHC Date ≤ current date

#### 2.2.4 Advanced Filters
- **Department:** Multi-select dropdown (dynamically populated from employee data)
- **Designation:** Multi-select dropdown (dynamically populated from employee data)
- **Location:** Multi-select dropdown (dynamically populated from employee data)

#### 2.2.5 Filter Actions
- **Apply Filters:** Primary button to apply selected filters
- **Clear All:** Secondary button to reset all filters
- **Filter Badge Display:** Shows active filters as removable badges

## 3. Employee Table

### 3.1 Table Structure

| Column | Type | Width | Sortable | Description |
|--------|------|-------|----------|-------------|
| ☐ | Checkbox | 40px | No | Select row for bulk actions |
| Emp ID | Text | 100px | Yes | Employee identifier |
| Name | Text | 200px | Yes | Full employee name |
| Email | Text | 250px | Yes | Email address |
| Mobile | Text | 120px | No | Mobile number |
| AHC Benefit Status | Badge | 140px | Yes | Status indicator with color coding |
| Benefit Source | Text | 150px | Yes | Rule name or group name |
| Next AHC Date | Date | 120px | Yes | Calculated eligibility date |
| Last AHC Date | Date | 120px | Yes | Previous health check date |
| Designation | Text | 150px | Yes | Job title |
| Location | Text | 120px | Yes | Work location |
| Passcode Status | Badge | 120px | No | Delivery status with color coding |
| Actions | Icons | 120px | No | Row-level action buttons |

### 3.2 Status Badge Color Coding
- **AHC Benefit Status:**
  - Not Booked: Gray
  - Booked: Blue
  - Medical Done: Green
- **Passcode Status:**
  - Sent: Blue
  - Delivered: Green
  - Bounced: Red
  - Not Sent: Gray

### 3.3 Table Features
- **Pagination:** 50 records per page with page navigation
- **Column Sorting:** 
  - First click on column header: Sort ascending (A-Z, 0-9, oldest to newest for dates)
  - Second click on same column: Sort descending (Z-A, 9-0, newest to oldest for dates)
  - Third click on same column: Remove sort (return to default order)
  - Visual indicators: Up arrow (↑) for ascending, Down arrow (↓) for descending
  - Only one column can be sorted at a time
  - Default sort on page load: Employee ID ascending
- **Responsive Design:** Horizontal scroll on smaller screens
- **Loading States:** Skeleton loader during data fetch
- **Empty States:** Informative message when no data matches filters
- **Select All:** Checkbox in header to select all visible rows

## 4. Row-Level Actions

### 4.1 Edit Employee
- **Icon:** Pencil/Edit icon
- **Tooltip:** "Edit Employee Details"
- **Functionality:** Opens Edit Employee modal

#### 4.1.1 Edit Employee Modal
**Modal Title:** "Edit Employee - [Employee Name]"

**Editable Fields:**
- Mobile Number (10-digit validation, required if updating)
- Employee Status (Dropdown: Active/Inactive)
- HR Name (Text field)
- HR Email (Email validation)
- Entity (Dropdown of available entities)
- Location (Dropdown of available locations)
- Designation (Text field)

**Read-Only Fields:**
- Employee ID
- Employee Name
- Email Address
- Date of Birth

**Actions:**
- **Save:** Validates and saves changes, triggers rule re-evaluation
- **Cancel:** Closes modal without saving

### 4.2 Send Passcode
- **Icon:** Mail/Send icon
- **Tooltip:** "Send Passcode"
- **Functionality:**
  - Generates new 6-digit passcode
  - Sends to employee's registered mobile/email
  - Updates passcode status to "Sent"
  - Shows success/error toast notification
  - Creates audit log entry

### 4.3 Activity Log
- **Icon:** Clock/History icon
- **Tooltip:** "View Activity Log"
- **Functionality:** Opens Activity Log modal

#### 4.3.1 Activity Log Modal
**Modal Title:** "Activity Log - [Employee Name]"

**Display Format:** Timeline view sorted by newest first

**Information Shown:**
- Timestamp
- User who performed action
- Action type
- Previous value
- New value
- Description

**Activity Types Tracked:**
- Status changes
- Eligibility updates
- Benefit assignments
- Passcode generation/sending
- Rule application changes
- Employee data modifications

### 4.4 View OPD Benefits
- **Icon:** Wallet/Medical icon
- **Tooltip:** "View OPD Benefits"
- **Visibility:** Only shown for employees with OPD benefits
- **Functionality:** Opens OPD Benefits modal showing wallet details and transaction history

## 5. Bulk Actions

### 5.1 Bulk Action Bar
- **Location:** Above table, appears when rows are selected
- **Display:** Shows count of selected employees
- **Actions Available:**

#### 5.1.1 Bulk Send Passcode
- **Label:** "Send Passcode"
- **Icon:** Send/Mail icon
- **Confirmation:** "Send passcode to [X] selected employees?"
- **Processing:**
  - Shows progress bar during operation
  - Generates unique passcode for each employee
  - Updates status for each employee
  - Shows summary of success/failures

#### 5.1.2 Export Selected
- **Label:** "Export to CSV"
- **Icon:** Download icon
- **Functionality:**
  - Exports selected employee data
  - Includes all visible columns
  - Filename format: Employees_Export_YYYY-MM-DD.csv

#### 5.1.3 Bulk Status Update
- **Label:** "Update Status"
- **Icon:** Edit icon
- **Options:** Active/Inactive
- **Confirmation:** Shows affected employee count

## 6. Export Functionality

### 6.1 Export All
- **Button Location:** Top right of the page
- **Label:** "Export"
- **Icon:** Download icon
- **Functionality:**
  - Exports all employees matching current filters
  - Maximum 2000 records per export
  - Shows notification if limit exceeded
  - CSV format with all columns

### 6.2 Export Format
**CSV Columns:**
- Employee ID
- Employee Name
- Email
- Mobile
- Department
- Designation
- Location
- AHC Benefit Status
- Benefit Source
- Next AHC Date
- Last AHC Date
- Passcode Status
- OPD Wallet Balance (if applicable)
- Employee Status

## 7. Business Logic

### 7.1 Eligibility Calculation
- **Next AHC Date Determination:**
  - For rule-based: Date of Joining + Rule frequency
  - For group-based: Current entitlement period
  - Shows "Not Eligible" if no active rule/group

### 7.2 Status Transitions
- **AHC Benefit Status Flow:**
  - Not Booked → Booked (when appointment scheduled)
  - Booked → Medical Done (when health check completed)
  - Medical Done → Not Booked (when new eligibility period starts)

### 7.3 Filter Logic
- **Between Filter Types:** AND operation
- **Within Same Filter:** OR operation (for multi-select)
- **Search + Filters:** AND operation

### 7.4 Data Refresh
- **Auto-refresh:** Every 5 minutes if no user activity
- **Manual refresh:** Refresh icon in top bar
- **Real-time updates:** For critical status changes

## 8. Validation Rules

### 8.1 Edit Employee Validation
- Mobile: 10 digits, numeric only
- Email: Valid email format
- Required fields cannot be empty
- Designation/Location changes trigger rule re-evaluation

### 8.2 Bulk Operation Limits
- Maximum 500 employees for bulk passcode send
- Maximum 2000 employees for export
- Bulk operations require confirmation for >50 employees

## 9. Error Handling

### 9.1 Error Scenarios
- **No Data:** "No employees found matching your criteria"
- **Filter Error:** "Unable to apply filters. Please try again"
- **Export Error:** "Export failed. Please try with fewer records"
- **Passcode Send Error:** "Failed to send passcode to [X] employees"

### 9.2 Error Display
- Toast notifications for transient errors
- Inline error messages for form validation
- Modal dialogs for critical errors

## 10. Audit Trail

All actions performed in the Employee Listing section are logged with:
- User performing action
- Timestamp
- Action type
- Affected employee(s)
- Previous and new values
- IP address
- Session ID

## 11. Accessibility Features

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators
- Descriptive labels and ARIA attributes
- Tooltips for all icons

## 12. Responsive Behavior

### 12.1 Desktop (>1200px)
- Full table view with all columns
- Side-by-side filter layout

### 12.2 Tablet (768px - 1200px)
- Horizontal scroll for table
- Stacked filter layout
- Condensed action buttons

### 12.3 Mobile (<768px)
- Card view instead of table
- Collapsible filters
- Swipe actions for row operations