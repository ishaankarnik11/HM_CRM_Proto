# Product Requirements Document (PRD)

**Project:** UI Updates for Claude Code Implementation  
**Product:** MyHealthMeter CRM - Accounting Module  
**Version:** 1.0  
**Date:** July 24, 2025  
**Author:** Product Team  
**Document Status:** Final

---

## Executive Summary

This PRD defines the UI update requirements for implementing the Accounting Module's revised Receivables flow in the MyHealthMeter CRM. The update enhances the existing search interface by making the Corporate, Entity, Location, and Service Type fields optional while maintaining the progressive three-screen selection flow. This provides flexibility for users to either use quick filters for direct access or explore available data through the drill-down approach.

---

## 1. Context and Objectives

### 1.1 Background
The current Receivables flow requires users to select multiple filters upfront without knowing what data is available. This leads to empty results and multiple search attempts. The new design provides a progressive drill-down approach that shows aggregated data at each level.

### 1.2 Objectives
- Improve data visibility during the invoice creation process
- Reduce empty search results
- Simplify the initial search interface
- Maintain consistency with existing CRM design patterns
- Enable better decision-making through progressive data display

### 1.3 Success Metrics
- Reduced number of searches with zero results
- Decreased time to create invoices
- Improved user satisfaction scores
- Fewer support tickets related to invoice creation

---

## 2. User Stories

### 2.1 Primary User Story
**As an** Accounting Executive  
**I want to** see available data at each level of selection  
**So that I** can make informed decisions about which invoices to create

### 2.2 Supporting User Stories
1. **As an** Accounting Manager, **I want to** quickly see all corporates with pending invoices **so that I** can prioritize processing
2. **As an** Accounting Executive, **I want to** see service-wise breakdowns **so that I** can create service-specific invoices
3. **As a** Finance Team member, **I want to** navigate between selection levels **so that I** can refine my choices

---

## 3. Functional Requirements

### 3.1 Search Initiation Screen

#### 3.1.1 UI Components to Modify
- Change button label from "Search Clients" to "Search"
- Update page header to "Search Medical Done Appointments"
- Make Corporate, Entity, Location, and Service Type fields **optional** (remove required field indicators)
- Update field placeholders to indicate optional status:
  - Corporate: "All Corporates (Optional)"
  - Entity: "All Entities (Optional)"
  - Location: "All Locations (Optional)"
  - Service Type: "All Service Types (Optional)"

#### 3.1.2 UI Components to Retain
- Start Date field with calendar picker (Required)
- End Date field with calendar picker (Required)
- Corporate dropdown field (Now optional)
- Entity dropdown field (Now optional)
- Location dropdown field (Now optional)
- Service Type dropdown field (Now optional)
- Form validation for date fields only

#### 3.1.3 Field Behavior Updates
- Remove validation requirements for Corporate, Entity, Location, Service Type
- Allow search with only date range populated
- If optional fields are selected, they will act as pre-filters for the results
- Default selection for optional fields: "All" or empty

### 3.2 Screen 1: Corporate Summary View

#### 3.2.1 New Screen Layout
**Header Section:**
- Page title: "Medical Done Appointments - Corporate Summary"
- Breadcrumb: Home > Accounting > Receivables > Corporate Summary
- Date range display: "Showing results for: [Start Date] to [End Date]"

**Data Table:**
```
| Corporate        | Candidates | Action |
|-----------------|------------|---------|
| Construction Corp| 100        | Select  |
| Manufacturing Co | 250        | Select  |
| Tech Solutions   | 75         | Select  |
```

#### 3.2.2 Table Specifications
- **Columns:**
  - Corporate: Left-aligned, sortable
  - Candidates: Center-aligned, sortable
  - Action: Right-aligned, button
- **Styling:**
  - Use existing table component styling
  - Alternate row shading
  - Hover effects on rows
  - "Select" button uses primary button style

#### 3.2.3 Interactive Elements
- Click "Select" navigates to Screen 2
- Sortable column headers
- Loading spinner while fetching data
- Empty state message if no results

#### 3.2.4 Pre-filtering Logic
- If user selected specific Corporate in initial search:
  - Show only that corporate in the summary
  - Optionally skip Screen 1 and go directly to Screen 2
- If user selected Entity/Location:
  - Filter corporate results to show only those with employees in selected entity/location
  - Display filter context at top: "Filtered by: Entity: [Name], Location: [Name]"
- If user selected Service Type:
  - Show only corporates that have employees with that service type
  - Display filter context: "Filtered by: Service Type: [Name]"

### 3.3 Screen 2: Service Breakdown View

#### 3.3.1 Screen Layout
**Header Section:**
- Page title: "[Corporate Name] - Service Breakdown"
- Breadcrumb: Home > Accounting > Receivables > Corporate Summary > Service Breakdown
- Date range display: "Showing results for: [Start Date] to [End Date]"
- Corporate name display: "Corporate: [Selected Corporate]"

**Data Table:**
```
| Service              | Candidates | Action |
|---------------------|------------|---------|
| Annual Health Checkup| 50         | Select  |
| Pre-Employment Check | 50         | Select  |
```

#### 3.3.2 Navigation
- "Back" button to return to Corporate Summary
- "Select" buttons navigate to Screen 3
- Maintain date range context

#### 3.3.3 Pre-filtering Impact
- If Service Type was pre-selected in initial search:
  - Show only that service type
  - Optionally skip Screen 2 and go directly to Screen 3
- Display active filters at top of screen
- Maintain all filter contexts from initial search

### 3.4 Screen 3: Employee Details View

#### 3.4.1 Screen Modifications
**Header Section Updates:**
- Add breadcrumb: Home > Accounting > Receivables > Corporate Summary > Service Breakdown > Employee Details
- Add context display:
  - "Date Range: [Start] to [End]"
  - "Corporate: [Selected Corporate]"
  - "Service: [Selected Service]"

**Table Display:**
- Use existing employee table structure
- Pre-filter data based on selections from Screens 1 & 2
- Maintain all existing functionality (checkboxes, sorting, etc.)

#### 3.4.2 Navigation
- "Back" button to return to Service Breakdown
- "Generate Invoice" button remains unchanged

---

## 4. Design Specifications

### 4.1 Visual Design Consistency
- Maintain existing MyHealthMeter CRM design system
- Use current color palette:
  - Primary Blue: #3b82f6
  - Success Green: #10b981
  - Background: #ffffff
  - Border: #e5e7eb
- Font family: System default (as per existing)
- Button styles: Match existing primary/secondary patterns

### 4.2 Component Specifications

#### 4.2.1 Tables
- Border: 1px solid #e5e7eb
- Header background: #f3f4f6
- Row height: 48px
- Padding: 12px horizontal
- Font size: 14px
- Hover state: Background #f9fafb

#### 4.2.2 Buttons
- Primary button (Select/Search):
  - Background: #3b82f6
  - Text: #ffffff
  - Padding: 8px 16px
  - Border radius: 6px
  - Hover: Darken 10%

#### 4.2.3 Breadcrumbs
- Font size: 12px
- Color: #6b7280
- Separator: ">"
- Active item: #111827

### 4.3 Responsive Behavior
- Minimum width: 1024px
- Tables: Horizontal scroll on smaller screens
- Maintain desktop-first approach

---

## 5. Technical Implementation Notes

### 5.1 State Management
- Maintain selected filters in session/state:
  - Date range (required)
  - Corporate (optional)
  - Entity (optional)
  - Location (optional)
  - Service Type (optional)
  - Selected corporate from Screen 1 (if not pre-filtered)
  - Selected service from Screen 2 (if not pre-filtered)
- Clear state on new search initiation

### 5.2 API Requirements
- Modify search endpoint to accept date range as required, others as optional
- Add endpoint for corporate summary aggregation with optional filters
- Add endpoint for service breakdown by corporate with optional filters
- Reuse existing employee list endpoint with combined filters

### 5.3 Performance Considerations
- Implement loading states for each screen
- Cache results during navigation
- Lazy load employee details
- Pagination for large result sets

### 5.4 Navigation Logic
**Smart Navigation Based on Pre-filters:**
1. If only date range selected → Show all 3 screens
2. If date + corporate selected → Skip Screen 1, start at Screen 2
3. If date + corporate + service selected → Skip Screens 1 & 2, go to Screen 3
4. If date + entity/location selected → Show filtered Screen 1
5. If date + service (no corporate) selected → Show Screen 1 with filtered corporates

---

## 6. User Experience Guidelines

### 6.1 Loading States
- Show skeleton loaders for tables
- Display "Loading..." text with spinner
- Maintain layout structure during load

### 6.2 Empty States
- Initial search: "Please select a date range to search"
- Screen 1: "No appointments found for the selected criteria"
- Screen 2: "No services found for [Corporate Name] with selected filters"
- Screen 3: "No employees found for the selected criteria"

### 6.3 Error Handling
- Date validation: "End date must be after start date"
- Required field: "Please select both start and end dates"
- Network errors: "Unable to fetch data. Please try again."
- Show inline error messages below fields

### 6.4 Navigation Flow
- Browser back button should work correctly
- Breadcrumb clicks navigate to respective screens
- Maintain filter context during navigation
- Clear selection when starting new search
- Show current filters as tags/chips at top of each screen
- Allow removing individual filters with 'x' button on tags

---

## 7. Acceptance Criteria

### 7.1 Functional Acceptance
- [ ] Date-only search works (with optional filters empty)
- [ ] Optional filters work when selected
- [ ] Smart navigation skips screens based on pre-filters
- [ ] Three-screen flow works with and without pre-filters
- [ ] Data aggregation shows correct counts with filters
- [ ] Filter context displayed on all screens
- [ ] Navigation maintains all filter contexts
- [ ] Invoice generation works with new flow

### 7.2 Design Acceptance
- [ ] Optional field indicators clear
- [ ] Filter tags/chips display correctly
- [ ] Screens match existing CRM design patterns
- [ ] All interactive elements have proper states
- [ ] Loading and error states implemented
- [ ] Responsive behavior works correctly

### 7.3 Performance Acceptance
- [ ] Each screen loads within 2 seconds
- [ ] Navigation between screens is smooth
- [ ] No data loss during navigation
- [ ] Browser back/forward works correctly

---

## 8. Testing Requirements

### 8.1 Test Scenarios
1. **Happy Path:**
   - Select only date range (no optional filters)
   - Navigate through all three screens
   - Successfully generate invoice

2. **Pre-filtered Paths:**
   - Select date + corporate → Skip to Screen 2
   - Select date + corporate + service → Skip to Screen 3
   - Select date + entity/location → See filtered Screen 1
   - Successfully complete flow from each starting point

3. **Edge Cases:**
   - Empty results at each level
   - Single result at each level
   - Large data sets (pagination)
   - Date validation errors
   - Conflicting filter combinations

4. **Navigation Tests:**
   - Browser back button
   - Breadcrumb navigation
   - Starting new search mid-flow
   - Removing filters via tags

### 8.2 Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 9. Implementation Timeline

### 9.1 Development Phases
1. **Phase 1:** Initial search screen updates (1 day)
2. **Phase 2:** Corporate summary screen (2 days)
3. **Phase 3:** Service breakdown screen (2 days)
4. **Phase 4:** Employee details integration (1 day)
5. **Phase 5:** Testing and bug fixes (2 days)

### 9.2 Total Estimated Time
- Development: 6 days
- Testing: 2 days
- **Total: 8 days**

---

## 10. Rollback Plan

### 10.1 Feature Toggle
- Implement feature flag for new flow
- Allow quick rollback to old flow if issues arise

### 10.2 Data Compatibility
- Ensure new flow works with existing data
- No database schema changes required
- Maintain backward compatibility

---

## Appendices

### Appendix A: Current vs New Flow Comparison

**Current Flow:**
1. User must select all filters (required)
2. Clicks "Search Clients"
3. Sees filtered employee list (or empty results)

**New Flow:**
1. User selects date range (required) + optional filters
2. System intelligently routes based on selections:
   - No optional filters → Full 3-screen flow
   - With corporate → Skip Screen 1
   - With corporate + service → Skip to Screen 3
3. Sees progressive drill-down or direct results

### Appendix B: Filter Combination Examples

**Example 1: Date Only**
- Input: Start Date + End Date
- Flow: Screen 1 → Screen 2 → Screen 3
- Shows all corporates with eligible employees

**Example 2: Date + Corporate**
- Input: Start Date + End Date + Corporate
- Flow: Screen 2 → Screen 3
- Shows services for selected corporate only

**Example 3: Date + Corporate + Service**
- Input: Start Date + End Date + Corporate + Service
- Flow: Screen 3 directly
- Shows employees matching all criteria

**Example 4: Date + Location**
- Input: Start Date + End Date + Location
- Flow: Screen 1 (filtered) → Screen 2 → Screen 3
- Shows only corporates with employees in that location

### Appendix C: Mock Data Examples

**Corporate Summary Data:**
```json
[
  { "corporate": "Construction Corp", "candidateCount": 100 },
  { "corporate": "Manufacturing Co", "candidateCount": 250 },
  { "corporate": "Tech Solutions", "candidateCount": 75 }
]
```

**Service Breakdown Data:**
```json
[
  { "service": "Annual Health Checkup", "candidateCount": 50 },
  { "service": "Pre-Employment Check", "candidateCount": 50 }
]
```

---

**Document Approval:**
- Product Owner: _________________
- UX Designer: _________________
- Technical Lead: _________________
- Date: _________________