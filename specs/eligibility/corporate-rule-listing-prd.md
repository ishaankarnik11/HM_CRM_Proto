# Product Requirement Document: Corporate Rule Listing Section

## 1. Overview

The Corporate Rule Listing section is a comprehensive interface for managing and monitoring eligibility rules that automatically determine employee benefit assignments based on configurable criteria. This section enables operations users to view, manage, and execute rules that control both Annual Health Check (AHC) and Outpatient Department (OPD) benefit allocations.

## 2. User Interface Components

### 2.1 Page Header

**Location:** Top of the rule listing page

**Components:**
- **Page Title:** "Corporate Eligibility Rules" (h1 heading)
- **Create Rule Button:** Primary action button positioned on the right
  - Label: "Create New Rule"
  - Icon: Plus icon
  - Color: Primary green (#28a745)
  - Action: Opens Rule Configuration Modal (blank state)

### 2.2 Filter Controls Bar

**Location:** Below page header, sticky on scroll

**Filter Options:**

1. **Rule Status Dropdown**
   - Label: "Status"
   - Options: 
     - All (default)
     - Active
     - Archived
   - Behavior: Real-time filtering

2. **Search Input Field**
   - Placeholder: "Search rules by name or description..."
   - Type: Text input with search icon
   - Behavior: Real-time search with 300ms debounce
   - Searches within: Rule name and criteria description

3. **Affected Employees Range Filter**
   - Label: "Affected Employees"
   - Type: Range selector or dropdown
   - Options:
     - All
     - 0-50 employees
     - 51-200 employees
     - 201-500 employees
     - 500+ employees
   - Behavior: Real-time filtering

**Clear Filters Link**
- Position: Right side of filter bar
- Label: "Clear all filters"
- Action: Resets all filters to default state

### 2.3 Rule List Table

**Table Structure:**

| Column | Width | Content | Sortable |
|--------|-------|---------|----------|
| ☐ | 40px | Bulk select checkbox | No |
| Rule Name | 25% | Rule identifier with hover tooltip | Yes |
| Status | 10% | Active/Archived badge | Yes |
| Criteria | 30% | Simplified rule description | No |
| Affected Employees | 15% | Count with clickable link | Yes |
| Last Evaluated | 15% | Timestamp format: "DD MMM YYYY, HH:MM" | Yes |
| Actions | 60px | Three-dot menu | No |

**Visual Elements:**

1. **Status Badges**
   - Active: Green badge with "Active" text
   - Archived: Gray badge with "Archived" text

2. **Affected Employees Count**
   - Format: Number with comma separator
   - Style: Clickable link (underlined on hover)
   - Action: Opens Eligible Employees Modal

3. **Criteria Display**
   - Shows simplified human-readable format
   - Maximum 100 characters with ellipsis
   - Full criteria shown in tooltip on hover

### 2.4 Bulk Actions Bar

**Visibility:** Only when one or more rules are selected

**Location:** Above the table, replaces filter bar temporarily

**Components:**
- **Selection Count:** "{n} rule(s) selected"
- **Select All Link:** "Select all {total} rules"
- **Actions:**
  - Archive Selected (requires confirmation)
  - Export Selected (downloads CSV)
- **Cancel Button:** Clears selection

### 2.5 Row Actions Menu

**Trigger:** Three-dot icon in Actions column

**Menu Items:**

1. **View Details**
   - Icon: Eye icon
   - Action: Opens Rule Details Modal (read-only view)
   - Availability: Always

2. **Edit Rule**
   - Icon: Pencil icon
   - Action: Opens Rule Configuration Modal (edit mode)
   - Availability: Active term only

3. **Evaluate Now**
   - Icon: Play/refresh icon
   - Action: Triggers manual rule evaluation
   - Availability: Active rules in active term only

4. **Archive Rule**
   - Icon: Archive icon
   - Action: Shows confirmation dialog, then archives
   - Availability: Active rules in active term only
   - Confirmation message: "Are you sure you want to archive '{Rule Name}'? This will stop the rule from being applied to employees."

5. **View Activity Log**
   - Icon: Clock/history icon
   - Action: Opens Activity Log Modal
   - Availability: Always

### 2.6 Pagination Controls

**Location:** Bottom of the table

**Components:**
- **Records per page selector:** Dropdown with options: 10, 25, 50, 100
- **Page navigation:** Previous/Next buttons with page numbers
- **Record count:** "Showing {start} to {end} of {total} rules"

### 2.7 Empty States

**No Rules Created:**
- Icon: Rules/settings illustration
- Message: "No eligibility rules created yet"
- Subtext: "Create rules to automatically assign benefits based on employee criteria"
- Action Button: "Create First Rule"

**No Results After Filtering:**
- Icon: Search/filter illustration
- Message: "No rules match your filters"
- Subtext: "Try adjusting your filters or search terms"
- Action Link: "Clear all filters"

## 3. Modal Dialogs

### 3.1 Rule Details Modal (View Only)

**Header:** "Rule Details: {Rule Name}"

**Content Sections:**

1. **Rule Information**
   - Rule Name
   - Status (with badge)
   - Created Date
   - Last Modified Date
   - Last Evaluated Date

2. **Criteria Section**
   - Full criteria display in structured format
   - Each condition on separate line
   - Logical operators clearly shown

3. **Benefits Assignment**
   - **AHC Configuration:**
     - Selected AHC Packages
     - Additional tests (if any)
   - **OPD Configuration:**
     - Total wallet amount
     - Service-wise sublimits
     - Family member access settings
   - **Effective Period**

4. **Affected Employees Summary**
   - Total count
   - Link to view full list

**Footer Actions:**
- Close Button
- Edit Rule Button (if active term)

### 3.2 Eligible Employees Modal

**Header:** "Employees Matching Rule: {Rule Name}"

**Subheader:** "{count} employees match this rule's criteria"

**Content:**
- Employee list table with columns:
  - Employee Name
  - Employee ID  
  - Department
  - Designation
  - Location
  - Current Benefits

**Features:**
- Search within results
- Export to CSV button
- Pagination (50 per page)

**Footer:**
- Close Button

### 3.3 Activity Log Modal

**Header:** "Activity Log: {Rule Name}"

**Content:**
- Timeline view of all rule-related activities
- Each entry shows:
  - Timestamp
  - User who performed action
  - Action description
  - Changes made (if applicable)

**Filter Options:**
- Date range picker
- Activity type filter
- User filter

**Footer:**
- Export to CSV button
- Close button

## 4. Loading States

**Table Loading:**
- Skeleton rows with animated shimmer effect
- Maintains table structure during load

**Action Loading:**
- Button shows spinner and becomes disabled
- Success/error toast notifications after completion

## 5. Error Handling

**Failed Rule Evaluation:**
- Error toast: "Failed to evaluate rule. Please try again."
- Detailed error in Activity Log

**Archive Failure:**
- Error dialog with specific error message
- Option to retry or cancel

## 6. Responsive Behavior

**Desktop (>1200px):** Full table with all columns

**Tablet (768px-1200px):** 
- Hide "Last Evaluated" column
- Criteria shown in expandable row

**Mobile (<768px):**
- Card-based layout
- Key information displayed vertically
- Actions accessible via swipe or long-press

## 7. Accessibility Features

- Keyboard navigation support for all interactive elements
- ARIA labels for screen readers
- Focus indicators for keyboard users
- Semantic HTML structure
- Color-blind friendly status indicators

## 8. Performance Considerations

- Virtual scrolling for large rule lists
- Lazy loading of eligible employee counts
- Debounced search and filter inputs
- Optimistic UI updates for toggle actions
- Background refresh of affected employee counts