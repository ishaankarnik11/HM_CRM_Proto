# Product Requirements Document
## Create New Corporate Rule Modal - Eligibility Module

### Version 1.0
### Date: January 2025

---

## 1. Overview

### 1.1 Purpose
This PRD defines the requirements for implementing a modal interface to create and configure corporate eligibility rules within the MyHealthMeter CRM Eligibility Management Module.

### 1.2 Scope
The modal will enable corporate administrators to define complex eligibility rules that automatically determine employee benefit assignments based on configurable criteria.

---

## 2. Modal Structure

### 2.1 Modal Header
- **Title**: "Create New Rule"
- **Subtitle**: "Configure rule conditions and actions for employee eligibility."
- **Close Button**: X icon in top-right corner
- **Enable/Disable Toggle**: Right-aligned toggle switch with "Enabled" label

### 2.2 Modal Layout
- **Width**: 900px (desktop), responsive on smaller screens
- **Height**: Auto-adjusting based on content
- **Background**: White with subtle shadow overlay
- **Sections**: Vertically stacked with clear visual separation

---

## 3. Form Sections

### 3.1 Rule Name Section
**Field Details:**
- **Label**: "Rule Name"
- **Type**: Text input
- **Placeholder**: "Enter rule name"
- **Validation**: Required, unique within corporate, max 100 characters
- **Width**: Full width

### 3.2 Criteria Section (AND Logic)
**Section Header:**
- **Title**: "Criteria (AND logic)"
- **Add Button**: "+ Add Condition" (right-aligned)

**Criteria Fields:**
Each condition row contains:

1. **Parameter Dropdown**
   - Options:
     - Department
     - Designation
     - Location
     - Employee ID
     - Join Date
     - Age
     - Gender
     - Employee Type
     - Custom Fields (if configured)

2. **Operator Dropdown**
   - Dynamic based on parameter type:
     - Text: Equals, Not Equals, Contains, Starts With, Ends With, In List, Not In List
     - Date: Equals, Before, After, Between, Not Between
     - Number: Equals, Greater Than, Less Than, Between, Not Between
     - Select: Equals, Not Equals, In List

3. **Value Input**
   - Dynamic based on parameter and operator:
     - Single text field for simple comparisons
     - Date picker for date fields
     - Multi-select for "In List" operators
     - Range inputs for "Between" operators

4. **Delete Button**
   - Trash icon to remove condition

### 3.3 Actions Configuration Section

#### 3.3.1 AHC Packages
**Section Header**: "AHC Packages"

**Package List:**
- [ ] Standard
- [ ] Premium  
- [ ] Executive
- [ ] Comprehensive
- [ ] Wellness
- [ ] Custom packages (if configured)

**Layout**: 2-column grid on desktop, single column on mobile

#### 3.3.2 Additional Tests
**Section Header**: "Additional Tests"

**Test Options:**
- [ ] Vitamin D
- [ ] B12
- [ ] Thyroid
- [ ] HbA1c
- [ ] Lipid Profile
- [ ] Iron Studies
- [ ] Kidney Panel
- [ ] Liver Panel
- [ ] Custom tests (if configured)

**Layout**: 2-column grid

#### 3.3.3 OPD Services & Sublimits
**Section Header**: "OPD Services & Sublimits"

**Wallet Balance Field:**
- Label: "Wallet Balance ₹"
- Type: Number input
- Placeholder: "0"
- Validation: Required if any OPD service selected, min 500, max 50000

**Service Configuration:**
Each service row contains:
- [ ] Checkbox (Service Name)
- Sublimit Amount field (₹) - Shows only when service is checked
- Dependent checkboxes: [ ] Spouse [ ] Parents [ ] In-laws
- [ ] Enable Reimbursement checkbox

Services:
- [ ] Consultation 
  - Sublimit: ₹_____ (appears when Consultation is checked)
  - Coverage for: [ ] Spouse [ ] Parents [ ] In-laws
  - [ ] Enable Reimbursement
  
- [ ] Diagnostics
  - Sublimit: ₹_____ (appears when Diagnostics is checked)
  - Coverage for: [ ] Spouse [ ] Parents [ ] In-laws
  - [ ] Enable Reimbursement
  
- [ ] Medicines
  - Sublimit: ₹_____ (appears when Medicines is checked)
  - Coverage for: [ ] Spouse [ ] Parents [ ] In-laws
  - [ ] Enable Reimbursement
  
- [ ] Dental
  - Sublimit: ₹_____ (appears when Dental is checked)
  - Coverage for: [ ] Spouse [ ] Parents [ ] In-laws
  - [ ] Enable Reimbursement
  
- [ ] VisionCare
  - Sublimit: ₹_____ (appears when VisionCare is checked)
  - Coverage for: [ ] Spouse [ ] Parents [ ] In-laws
  - [ ] Enable Reimbursement

**Note**: Total of sublimits can exceed wallet balance to accommodate dependent coverage

#### 3.3.4 Other Settings
**Section Header**: "Other Settings"

**Additional Options:**
- [ ] Auto-renewal
- [ ] Send notifications

---

## 4. Modal Footer

### 4.1 Action Buttons
- **Cancel**: Secondary button, left-aligned
- **Save Rule**: Primary button, right-aligned

### 4.2 Button States
- **Save Rule**: Disabled until all required fields are valid
- **Cancel**: Always enabled

---

## 5. Interaction Specifications

### 5.1 Field Interactions
- **Real-time validation**: Show inline errors immediately
- **Dynamic operators**: Update based on selected parameter
- **Smart defaults**: Pre-fill common values where applicable
- **Tooltips**: Hover help for complex fields

### 5.2 Condition Management
- **Add Condition**: Adds new criteria row with animation
- **Delete Condition**: Removes with confirmation if data entered
- **Drag to Reorder**: Allow conditions to be reordered (optional)

### 5.3 OPD Calculations
- **Dynamic field display**: Sublimit amount field appears only when service is checked
- **Independent dependent selection**: Each service can have different dependent coverage
- **No balance restriction**: Sublimits can exceed wallet balance for dependent coverage
- **Visual indicator**: Show total sublimit amount vs wallet balance for reference

---

## 6. Validation Rules

### 6.1 Form-Level Validations
- At least one criteria condition required
- At least one action selected (AHC package, test, or OPD service)
- Rule name is unique within corporate
- If OPD services selected, wallet balance must be specified
- At least one dependent must be selected if sublimit is entered for a service

### 6.2 Field-Level Validations
- Required fields cannot be empty
- Numeric fields accept only valid numbers
- Date ranges: start date ≤ end date
- Sublimits must be positive when service is enabled
- Sublimit amount field is required when service checkbox is checked
- At least one dependent (Spouse/Parents/In-laws) must be selected when sublimit is entered
- Wallet balance within allowed range (₹500 - ₹50,000)
- Individual sublimits can exceed wallet balance

### 6.3 Error Display
- Inline error messages below fields
- Red border on invalid fields
- Summary error message if save attempted with errors
- Clear error indicators when corrected

---

## 7. Responsive Design

### 7.1 Desktop (>1024px)
- Full modal width: 900px
- 2-column layout for checkboxes
- Side-by-side arrangement for related fields

### 7.2 Tablet (768px - 1024px)
- Modal width: 90% of screen
- Single column for most sections
- Stacked layout for OPD services

### 7.3 Mobile (<768px)
- Full-screen modal
- Single column throughout
- Larger touch targets for checkboxes
- Sticky footer with action buttons

---

## 8. Accessibility Requirements

### 8.1 Keyboard Navigation
- Tab order follows logical flow
- Enter key submits form
- Escape key closes modal
- Arrow keys navigate dropdowns

### 8.2 Screen Reader Support
- Proper ARIA labels
- Form field descriptions
- Error announcements
- State changes announced

### 8.3 Visual Accessibility
- Minimum contrast ratio 4.5:1
- Focus indicators on all interactive elements
- Error states not solely color-dependent
- Clear visual hierarchy

---

## 9. Performance Requirements

### 9.1 Loading Performance
- Modal opens within 300ms
- Field interactions respond within 100ms
- Save operation completes within 2 seconds
- Progress indicator for operations >500ms

### 9.2 Data Handling
- Client-side validation for immediate feedback
- Debounced API calls for uniqueness checks
- Optimistic UI updates where appropriate
- Graceful error handling

---

## 10. Success Metrics

### 10.1 User Efficiency
- Average time to create a rule: <3 minutes
- Error rate on first save attempt: <20%
- Rule modification frequency: Track for insights
- Dependent coverage adoption rate: Track usage patterns

### 10.2 System Performance
- Modal load time: <300ms
- Save success rate: >99%
- Validation accuracy: 100%
- OPD configuration completion rate: >90%

---

## 11. Future Enhancements

### 11.1 Phase 2 Features
- Rule templates for common scenarios
- Bulk rule creation via CSV import
- A/B testing for rule effectiveness
- Advanced criteria with OR logic support

### 11.2 Phase 3 Features
- AI-powered rule suggestions
- Predictive impact analysis
- Rule versioning and rollback
- Advanced scheduling options

---

## 12. Technical Notes

### 12.1 State Management
- Form state managed locally until save
- Validation state updated in real-time
- Preserve form data on accidental close

### 12.2 API Integration
- POST endpoint for rule creation
- Real-time validation endpoints
- Batch validation for performance

### 12.3 Security Considerations
- CSRF protection on form submission
- Input sanitization for all fields
- Role-based access control
- Audit logging for all rule changes