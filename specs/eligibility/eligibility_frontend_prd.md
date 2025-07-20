# Product Requirements Document (PRD)

**Project:** MyHealthMeter CRM - Eligibility Module Frontend Prototype  
**Version:** 1.0  
**Date:** July 19, 2025  
**Author:** Development Team  
**Document Type:** Frontend Prototype Development  

---

## 1. Project Context

### 1.1 Existing Application
- **Application Name:** MyHealthMeter CRM
- **Current Modules:** Dashboard, Appointment Tracker, Accounting, Reports, Onsite Onboarding, Offline Onboarding, OPD Claims, Settings
- **Technology Stack:** Web-based application with responsive design
- **Current State:** Accounting module prototype already implemented and functional

### 1.2 Objective
Develop a fully functional frontend prototype for the Eligibility Management module that integrates seamlessly with the existing MyHealthMeter CRM application. The prototype will demonstrate all eligibility management workflows with realistic mock data and simulated API responses.

---

## 2. Scope and Deliverables

### 2.1 In Scope
- Frontend user interface for all eligibility management screens
- Navigation integration with existing left sidebar menu
- Mock API endpoints for all data operations
- Comprehensive dummy data for realistic demonstration
- Complete workflow simulations for eligibility management
- Responsive design matching existing application standards

### 2.2 Out of Scope
- Backend database implementation
- Real API integration
- Authentication and security implementation
- Integration with dependent modules
- Production deployment configuration
- Performance optimization

---

## 3. Navigation Integration

### 3.1 Left Sidebar Menu Update
Add "Eligibility" as a new menu item in the existing left navigation structure:

**Current Menu Structure:**
- Dashboard
- Appointment Tracker
- **Eligibility** ← NEW ADDITION
- Accounting
- Reports
- Onsite Onboarding
- Offline Onboarding
- OPD Claims
- Settings

### 3.2 Navigation Behavior
- Clicking "Eligibility" should navigate to the main Eligibility Dashboard
- Maintain the same active state styling as other menu items
- Use the existing green color scheme and iconography
- Include appropriate icon for eligibility (suggested: users or shield icon)

---

## 4. Screen Requirements

### 4.1 Main Eligibility Dashboard
**Purpose:** Central hub for eligibility management with key metrics and quick actions

**Components:**
- Summary metrics cards (Total Employees, Active Eligibilities, Pending Validations, OPD Wallet Balance)
- Quick action buttons (Upload Employees, Create Benefit Group, Generate Reports)
- Recent activity feed showing latest eligibility changes
- Pie chart showing eligibility status distribution
- Bar chart showing OPD wallet utilization by corporate

**Mock Data Required:**
- 1,247 total employees across 15 corporates
- 1,156 active eligibilities
- 23 pending validations
- ₹24.6L total OPD wallet balance
- Activity feed with 20 recent entries

### 4.2 Employee Management Screen
**Purpose:** Comprehensive employee data management with search, filter, and bulk operations

**Components:**
- Employee search bar with filters (Corporate, Status, Benefit Group, Location)
- Employee data table with columns: Employee ID, Name, Corporate, Department, Eligibility Status, Benefit Group, OPD Wallet Balance, Actions
- Bulk upload interface with file drop zone
- Individual employee detail modal
- Bulk actions toolbar (Update Status, Assign Benefit Group, Send Passcodes)

**Mock Data Required:**
- 1,200+ employee records with varied data
- Multiple corporates (Energy Solutions Inc, Tech Corp, Healthcare Plus, Manufacturing Ltd, etc.)
- Various eligibility statuses (Active, Inactive, Pending, Suspended)
- Different benefit groups (Premium, Standard, Basic, Executive)
- Realistic OPD wallet balances (₹5,000 - ₹25,000)

### 4.3 Benefit Groups Management
**Purpose:** Create and manage benefit group configurations

**Components:**
- Benefit groups listing table
- Create new benefit group form
- Edit existing benefit group modal
- Benefit group details view with assigned employees
- Copy benefit group functionality

**Benefit Group Fields:**
- Group Name
- Description
- AHC (Annual Health Check) Benefits
- OPD Wallet Allocation
- Family Coverage Details
- Validity Period
- Eligibility Criteria

**Mock Data Required:**
- 8-10 predefined benefit groups
- Varied allocation amounts and coverage types
- Employee assignment counts for each group

### 4.4 Eligibility Rules Engine
**Purpose:** Configure and manage eligibility determination rules

**Components:**
- Rules listing with priority order
- Rule builder interface with condition blocks
- Rule testing simulator
- Active/inactive rule status toggle
- Rule history and audit trail

**Rule Configuration Fields:**
- Rule Name and Description
- Conditions (Service Period, Age, Department, Location, etc.)
- Actions (Assign Benefit Group, Set Wallet Amount, etc.)
- Priority Level
- Effective Date Range

**Mock Data Required:**
- 15-20 sample rules covering various scenarios
- Different condition combinations
- Rule execution history logs

### 4.5 OPD Wallet Management
**Purpose:** Monitor and manage OPD wallet allocations and transactions

**Components:**
- Wallet overview dashboard
- Employee wallet search and management
- Transaction history viewer
- Bulk wallet allocation interface
- Wallet usage analytics

**Wallet Information Display:**
- Employee details
- Current balance
- Allocated amount
- Used amount
- Transaction history
- Family member wallet access

**Mock Data Required:**
- Transaction histories for 50+ employees
- Various transaction types (Allocation, Usage, Adjustment, Carry Forward)
- Family member sharing scenarios
- Different wallet statuses (Active, Suspended, Expired)

### 4.6 Upload and Validation Interface
**Purpose:** Handle bulk employee data uploads with validation

**Components:**
- File upload dropzone
- Template download links
- Upload progress indicator
- Validation results display
- Error correction interface
- Preview before final import

**Validation Features:**
- Real-time format validation
- Duplicate detection
- Missing field identification
- Data consistency checks
- Error highlighting with correction suggestions

**Mock Data Required:**
- Sample CSV/Excel templates
- Validation error scenarios
- Successful upload confirmations

### 4.7 Reports and Analytics
**Purpose:** Generate eligibility and OPD wallet reports

**Components:**
- Pre-defined report templates
- Custom report builder
- Report scheduling interface
- Export functionality (PDF, Excel, CSV)
- Report history and sharing

**Report Types:**
- Eligibility Status Report
- OPD Wallet Utilization Report
- Employee Benefits Summary
- Corporate-wise Analytics
- Audit Trail Reports

**Mock Data Required:**
- Sample report outputs
- Various date ranges and filter combinations
- Graphical representations of data

---

## 5. Mock API Requirements

### 5.1 Core API Endpoints
Create mock API responses for the following endpoints:

**Employee Management:**
- `GET /api/employees` - List employees with pagination and filters
- `POST /api/employees/upload` - Bulk employee upload
- `GET /api/employees/{id}` - Get employee details
- `PUT /api/employees/{id}` - Update employee information
- `POST /api/employees/bulk-action` - Bulk operations on employees

**Benefit Groups:**
- `GET /api/benefit-groups` - List all benefit groups
- `POST /api/benefit-groups` - Create new benefit group
- `PUT /api/benefit-groups/{id}` - Update benefit group
- `DELETE /api/benefit-groups/{id}` - Delete benefit group
- `GET /api/benefit-groups/{id}/employees` - Get employees in benefit group

**Eligibility Rules:**
- `GET /api/eligibility-rules` - List all rules
- `POST /api/eligibility-rules` - Create new rule
- `PUT /api/eligibility-rules/{id}` - Update rule
- `POST /api/eligibility-rules/test` - Test rule conditions

**OPD Wallets:**
- `GET /api/opd-wallets` - List wallet information
- `GET /api/opd-wallets/{employeeId}/transactions` - Get transaction history
- `POST /api/opd-wallets/allocate` - Bulk wallet allocation
- `PUT /api/opd-wallets/{employeeId}` - Update wallet information

**Reports:**
- `GET /api/reports/templates` - List available report templates
- `POST /api/reports/generate` - Generate custom report
- `GET /api/reports/{id}/download` - Download report file

### 5.2 Response Data Structure
Ensure mock APIs return realistic data structures with:
- Proper HTTP status codes
- Consistent JSON response format
- Pagination metadata where applicable
- Error handling responses
- Loading delays (500-1000ms) to simulate real API behavior

---

## 6. Mock Data Specifications

### 6.1 Corporate Data
- Energy Solutions Inc (450 employees)
- Tech Innovations Corp (280 employees)
- Healthcare Plus Ltd (320 employees)
- Manufacturing Solutions (197 employees)
- Financial Services Inc (215 employees)

### 6.2 Employee Profiles
Generate diverse employee data including:
- Realistic Indian names
- Various departments (HR, IT, Finance, Operations, Sales, etc.)
- Different locations (Mumbai, Delhi, Bangalore, Chennai, Pune)
- Age ranges (22-60 years)
- Service periods (1 month to 15 years)
- Mixed eligibility statuses

### 6.3 Transaction Data
Create realistic OPD transaction scenarios:
- Doctor consultations (₹500-2000)
- Diagnostic tests (₹800-5000)
- Pharmacy purchases (₹200-1500)
- Family member transactions
- Reimbursement requests

---

## 7. UI/UX Design Guidelines

### 7.1 Design Reference
**Important Note:** Reference screenshots are stored in `./screenshots` folder for design inspiration only. These screenshots showcase the desired visual style and UX patterns but may contain features or fields not specified in this PRD.

### 7.2 Visual Design System

**Color Palette:**
- Primary Blue: #3B82F6 (for primary actions, active states)
- Success Green: #10B981 (for positive actions, success states)
- Warning Orange: #F59E0B (for warnings, pending states)
- Error Red: #EF4444 (for errors, destructive actions)
- Gray Scale: #F9FAFB, #F3F4F6, #E5E7EB, #9CA3AF, #6B7280, #374151
- Text Colors: #111827 (primary), #6B7280 (secondary), #9CA3AF (muted)

**Typography:**
- Font Family: Inter or similar modern sans-serif
- Heading sizes: text-2xl, text-xl, text-lg for primary headings
- Body text: text-sm, text-base for content
- Small text: text-xs for labels and secondary information

**Spacing System:**
- Use consistent padding: 4px, 8px, 12px, 16px, 20px, 24px, 32px
- Card margins: 16px-24px between cards
- Form field spacing: 16px between fields
- Button padding: 8px-16px horizontal, 6px-12px vertical

### 7.3 Component Design Specifications

**Cards and Containers:**
- White background with subtle shadow: `shadow-sm border border-gray-200`
- Rounded corners: 8px border radius
- Consistent padding: 16px-24px for content areas
- Clean borders with #E5E7EB color

**Buttons:**
- Primary: Blue background (#3B82F6) with white text, rounded corners
- Secondary: White background with gray border and dark text
- Success: Green background (#10B981) with white text
- Danger: Red background (#EF4444) with white text
- Button heights: 36px-40px with appropriate padding
- Hover states with slight opacity or color changes

**Form Elements:**
- Input fields: White background, gray border, 8px border radius
- Focus states: Blue border color matching primary
- Label positioning: Above input fields with adequate spacing
- Placeholder text in muted gray color
- Error states with red border and error text below

**Tables:**
- Clean, minimal design with alternating row colors
- Header row with slightly darker background (#F9FAFB)
- Cell padding: 12px-16px for comfortable spacing
- Border-bottom for row separation
- Hover states for interactive rows

**Status Indicators:**
- Pills/badges with rounded corners and appropriate colors
- Active: Green background with white text
- Inactive: Gray background with dark text
- Pending: Orange/yellow background with dark text
- Error: Red background with white text

### 7.4 Layout and Navigation

**Page Structure:**
- Consistent page headers with title and action buttons
- Breadcrumb navigation below main header
- Content areas with proper whitespace and margins
- Sticky headers for long tables/lists

**Modal Dialogs:**
- Overlay with semi-transparent dark background
- White modal container with rounded corners
- Header section with title and close button
- Content area with proper padding
- Footer with action buttons aligned right

**Responsive Breakpoints:**
- Mobile: 768px and below - stack elements vertically
- Tablet: 769px to 1024px - adjusted layouts
- Desktop: 1025px and above - full feature layout

### 7.5 Interactive Elements

**Search and Filters:**
- Search bars with magnifying glass icons
- Filter dropdowns with clear labels
- Applied filters shown as removable chips
- Clear all filters option when multiple filters applied

**Data Tables:**
- Sortable columns with sort indicators
- Pagination controls at bottom right
- Row selection with checkboxes
- Bulk action toolbar appears when rows selected
- Export buttons prominently placed

**Upload Interfaces:**
- Drag-and-drop zones with dashed borders
- File type and size indicators
- Progress bars for upload status
- Success/error feedback with clear messaging

### 7.6 User Experience Patterns

**Progressive Disclosure:**
- Multi-step wizards with clear progress indicators
- Expandable sections for advanced options
- Contextual information revealed on hover/click
- Step-by-step guidance for complex workflows

**Feedback and Notifications:**
- Toast notifications for actions (top-right corner)
- Inline validation messages for forms
- Loading states with skeleton screens or spinners
- Empty states with helpful guidance and actions

**Error Handling:**
- Clear error messages with suggested actions
- Validation feedback in real-time
- Graceful degradation for failed operations
- Retry mechanisms for failed actions

### 7.7 Data Visualization

**Summary Cards:**
- Large, prominent numbers for key metrics
- Subtle background colors to differentiate categories
- Icons to reinforce meaning
- Comparison indicators (up/down arrows) where relevant

**Charts and Graphs:**
- Clean, minimal design with muted colors
- Clear labels and legends
- Interactive hover states with detailed information
- Responsive design for different screen sizes

**Status Distributions:**
- Pie charts for percentage breakdowns
- Bar charts for comparative data
- Color coding consistent with status indicators
- Clear legends and labels

### 7.8 Mobile Responsiveness

**Mobile-First Approach:**
- Touch-friendly button sizes (minimum 44px)
- Adequate spacing between interactive elements
- Simplified navigation for smaller screens
- Swipe gestures for table navigation

**Adaptive Layouts:**
- Stack form fields vertically on mobile
- Collapsible navigation menu
- Horizontal scrolling for wide tables
- Modal dialogs that work well on mobile

### 7.9 Accessibility Considerations

**Color and Contrast:**
- Ensure sufficient color contrast ratios (4.5:1 minimum)
- Don't rely solely on color to convey information
- Provide alternative text for icons and images

**Keyboard Navigation:**
- Proper tab order through interactive elements
- Visible focus indicators
- Keyboard shortcuts for common actions
- Skip links for screen readers

**Screen Reader Support:**
- Semantic HTML structure
- Proper heading hierarchy
- ARIA labels for complex interactions
- Form labels properly associated with inputs

### 7.10 Animation and Transitions

**Subtle Animations:**
- Smooth transitions between states (0.2s-0.3s duration)
- Hover effects on interactive elements
- Loading animations that don't distract
- Page transitions that feel responsive

**Performance Considerations:**
- CSS transitions over JavaScript animations
- Minimal animation on mobile devices
- Respect user preferences for reduced motion
- Smooth scrolling for better UX

---

## 8. Technical Implementation Notes

### 8.1 Frontend Framework
- Use the same technology stack as the existing application
- Maintain consistent component architecture
- Implement proper state management for complex workflows
- Ensure responsive design across all screen sizes

### 8.2 Mock Data Management
- Store mock data in JSON files or in-memory structures
- Implement realistic data relationships
- Include data persistence across browser sessions
- Provide data reset functionality for demonstration purposes

### 8.3 Development Priorities
1. Navigation integration and main dashboard
2. Employee management with search and filters
3. Benefit groups creation and management
4. OPD wallet management interface
5. Upload and validation workflows
6. Reports and analytics screens
7. Polish and final testing

---

## 9. Success Criteria

### 9.1 Functional Requirements
- All screens render correctly with mock data
- Navigation between screens works smoothly
- All forms accept input and show validation
- Search and filter functionality operates correctly
- Mock API calls simulate realistic loading times
- Data appears realistic and comprehensive

### 9.2 Visual Requirements
- Screens look populated with meaningful data
- UI matches existing application standards
- Responsive design works on different screen sizes
- Loading states and transitions are smooth
- Error handling provides clear feedback

### 9.3 Demonstration Readiness
- Application can be demonstrated to clients effectively
- All major workflows can be shown end-to-end
- Data appears realistic and professional
- Performance is smooth for demonstration purposes
- No obvious placeholder or "under construction" elements

---

## 10. Deliverables Timeline

### Phase 1: Foundation (Days 1-2)
- Navigation integration
- Main dashboard with summary cards
- Basic employee listing screen

### Phase 2: Core Functionality (Days 3-5)
- Complete employee management interface
- Benefit groups management screens
- OPD wallet management interface

### Phase 3: Advanced Features (Days 6-7)
- Eligibility rules engine interface
- Upload and validation workflows
- Reports and analytics screens

### Phase 4: Polish and Testing (Day 8)
- UI refinements and bug fixes
- Final testing and demonstration preparation
- Mock data verification and enhancement

---

This PRD provides comprehensive guidance for developing a fully functional eligibility module frontend prototype that integrates seamlessly with the existing MyHealthMeter CRM application while showcasing all essential eligibility management capabilities through realistic mock data and simulated workflows.