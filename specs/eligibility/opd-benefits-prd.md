# Product Requirements Document
## OPD Benefits in Corporate Rule Creation - Eligibility Module

### Version 1.0
### Date: [Current Date]

---

## 1. Executive Summary

This PRD defines the requirements for implementing OPD (Outpatient Department) benefits management within the corporate rule creation feature of the Eligibility Module. The system enables corporates to configure automated rules that assign OPD wallet benefits to employees based on defined criteria, supporting service-specific sublimits, family member access, and flexible reimbursement options.

## 2. Background and Context

### 2.1 Current State
- Corporate health benefits are managed through fragmented systems
- Manual assignment of OPD benefits leads to errors and delays
- No standardized way to configure service-specific limits
- Limited family member benefit tracking
- Inefficient reimbursement eligibility management

### 2.2 Business Opportunity
- Automate OPD benefit assignment based on employee attributes
- Enable granular control over service-specific spending limits
- Support flexible family member benefit configurations
- Streamline cashless and reimbursement transaction management
- Provide comprehensive audit trails for compliance

## 3. Objectives and Goals

### 3.1 Primary Objectives
- Enable rule-based automated OPD wallet creation and management
- Support service-specific sublimit configurations
- Implement flexible family member access controls
- Provide both cashless and reimbursement options per service
- Ensure wallet balance integrity and transaction compliance

### 3.2 Success Metrics
- 80% reduction in manual OPD benefit assignment time
- 95% accuracy in rule-based benefit allocation
- Zero wallet balance discrepancies
- 90% user satisfaction with configuration interface
- 100% audit trail completeness

## 4. User Personas

### 4.1 Operations Manager
- **Role**: Configure and manage corporate benefit rules
- **Goals**: Efficiently set up OPD benefits for employee segments
- **Pain Points**: Complex manual processes, lack of flexibility

### 4.2 HR Administrator
- **Role**: Define benefit policies and employee eligibility
- **Goals**: Ensure correct benefit assignment per corporate policy
- **Pain Points**: Difficulty in implementing varied benefit structures

### 4.3 Finance Controller
- **Role**: Monitor benefit utilization and budget compliance
- **Goals**: Control spending within allocated budgets
- **Pain Points**: Limited visibility into service-wise spending

## 5. Functional Requirements

### 5.1 Rule Configuration Interface

#### 5.1.1 OPD Benefits Section
The rule configuration modal shall include an OPD Benefits section with:

**Total Wallet Configuration**
- Input field for total annual OPD wallet amount (₹)
- Validation: Must be positive number if any OPD service is enabled
- Format: Currency with thousands separator
- Range: ₹1,000 to ₹100,000

**Service-Specific Configuration Grid**
A table/grid displaying all OPD services with columns for:
- Service Name (read-only)
- Enable Service (checkbox)
- Sublimit Amount (₹) (input field)
- Per-Transaction Limit (₹) (input field)
- Enable Reimbursement (checkbox)
- Family Member Access (multi-select checkboxes)

#### 5.1.2 Supported OPD Services
The system shall support the following services:
- Doctor Consultation
- Diagnostics/Lab Tests
- Medicines/Pharmacy
- Dental Care
- Vision/Eye Care

#### 5.1.3 Service Configuration Rules
For each enabled service:
- Sublimit amount is mandatory and must be > 0
- Per-transaction limit must be ≤ sublimit amount
- Sum of all sublimits must equal total wallet amount
- At least one family member (employee) must have access

### 5.2 Family Member Configuration

#### 5.2.1 Supported Family Members
- Employee (always included, non-editable)
- Spouse
- Children
- Parents
- Parents-in-law

#### 5.2.2 Access Control Matrix
Each service can independently configure which family members have access:
- Different services can have different family member configurations
- All family members share the employee's wallet balance
- Same sublimits and transaction limits apply to all included members

### 5.3 Wallet Creation Logic

#### 5.3.1 Automatic Wallet Generation
When an employee matches a rule with OPD benefits:
- System creates an OPD wallet with configured total amount
- Service-wise configurations are stored with the wallet
- Family member access permissions are recorded
- Wallet is linked to the current program term

#### 5.3.2 Wallet Balance Model
- Single main wallet balance for all transactions
- Service sublimits act as spending categories
- Transactions validate against both main balance and sublimit
- Per-transaction limits apply only to cashless payments

### 5.4 Validation Rules

#### 5.4.1 Configuration Validations
- Total wallet amount required if any service enabled
- Each enabled service must have sublimit > 0
- Sum of sublimits must equal total wallet amount
- Per-transaction limit ≤ service sublimit
- At least one service must be enabled if OPD section is used

#### 5.4.2 Runtime Validations
- Transaction amount ≤ available wallet balance
- Transaction amount ≤ remaining service sublimit
- Cashless transaction ≤ per-transaction limit
- Family member must have access to the service

### 5.5 User Interface Requirements

#### 5.5.1 Visual Design
- Collapsible OPD Benefits section in rule configuration
- Service grid with clear enable/disable states
- Visual indicators for validation errors
- Auto-calculation of remaining allocation amount
- Responsive design for various screen sizes

#### 5.5.2 Interaction Patterns
- Enable service checkbox activates row for editing
- Sublimit changes update remaining allocation indicator
- Family member checkboxes disabled when service disabled
- Save button disabled until all validations pass

### 5.6 Data Management

#### 5.6.1 Rule Storage
Store OPD configuration as part of rule definition:
- Total wallet amount
- Service configurations array
- Family member access matrix
- Creation and modification timestamps

#### 5.6.2 Audit Trail
Track all OPD-related changes:
- Rule creation with OPD benefits
- Configuration modifications
- Wallet creation events
- Service enable/disable changes

## 6. Non-Functional Requirements

### 6.1 Usability
- Configuration process completable in < 5 minutes
- Clear error messages for validation failures
- Intuitive interface requiring minimal training
- Contextual help for complex configurations

### 6.2 Reliability
- 99.9% uptime for rule processing
- Zero data loss for wallet configurations
- Automatic recovery from system failures
- Transaction integrity maintained

### 6.3 Security
- Role-based access to rule configuration
- Encryption of sensitive benefit data
- Audit logging of all configuration changes
- Secure API endpoints for wallet operations

## 7. Integration Requirements

### 7.1 Internal Systems
- Employee master data synchronization
- Program term management integration
- Wallet balance tracking system
- Transaction processing module

### 7.2 External Systems
- No external integrations required for Phase 1
- Future: Payment gateway integration
- Future: Claims management system

## 8. User Experience Flow

### 8.1 Rule Creation Flow
1. User opens Create Rule modal
2. Configures basic rule details and criteria
3. Expands OPD Benefits section
4. Enters total wallet amount
5. Enables required services
6. Configures sublimits for each service
7. Sets per-transaction limits
8. Selects family member access
9. Enables reimbursement where applicable
10. Saves rule after validation

### 8.2 Wallet Usage Flow
1. Employee/family member initiates OPD transaction
2. System validates service eligibility
3. Checks wallet balance and sublimit
4. For cashless: validates transaction limit
5. Processes transaction and updates balances
6. Records transaction details for audit

## 9. Acceptance Criteria

### 9.1 Configuration Acceptance
- Admin can configure OPD benefits within rules
- Service-specific sublimits can be set
- Family member access is configurable per service
- Validation prevents invalid configurations
- Configuration changes are audited

### 9.2 Processing Acceptance
- Wallets created automatically for eligible employees
- Transactions respect all configured limits
- Family members can access enabled services
- Balance updates are accurate and immediate
- All transactions are logged

## 10. Release Planning

### 10.1 Phase 1 (MVP)
- Basic OPD configuration in rules
- Service sublimit management
- Employee-only access
- Cashless transaction support

### 10.2 Phase 2
- Family member access configuration
- Reimbursement eligibility settings
- Enhanced validation rules
- Bulk rule creation

### 10.3 Phase 3
- Advanced reporting
- Budget forecasting
- Auto-adjustment rules
- API for external systems

## 11. Dependencies

### 11.1 Technical Dependencies
- Rule engine framework
- Wallet management system
- Transaction processing module
- Audit logging infrastructure

### 11.2 Business Dependencies
- Corporate OPD benefit policies
- Service provider agreements
- Budget approvals
- Compliance requirements

## 12. Risks and Mitigation

### 12.1 Technical Risks
- **Risk**: Complex validation logic impacts performance
- **Mitigation**: Implement efficient validation algorithms

### 12.2 Business Risks
- **Risk**: Misconfiguration leads to budget overruns
- **Mitigation**: Implement approval workflows for high-value rules

## 13. Success Criteria

### 13.1 Launch Criteria
- All validations working correctly
- UI responsive and intuitive
- Audit trail complete
- User acceptance testing passed
- Documentation complete

### 13.2 Post-Launch Metrics
- Rule creation time < 5 minutes
- Zero critical bugs in production
- 90% user task completion rate
- < 2% configuration error rate

## 14. Appendix

### 14.1 Glossary
- **OPD**: Outpatient Department
- **Sublimit**: Service-specific spending limit within total wallet
- **Per-transaction limit**: Maximum amount for single cashless transaction
- **Program Term**: Annual benefit period

### 14.2 References
- Eligibility Management FRD v4.1
- OPD Wallet Management System Specifications
- Corporate Benefits Policy Guidelines