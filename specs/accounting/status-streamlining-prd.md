# MyHealthMeter CRM - Accounting Module Status Streamlining PRD

## 1. Overview

This PRD outlines the streamlining of statuses in the MyHealthMeter CRM Accounting Module. The application is already developed; only status-related changes are required.

**Document Version:** 1.0  
**Date:** January 2025  
**Author:** Product Team  
**For:** Development Team

---

## 2. Current State vs Target State

### 2.1 What's Changing

| Component | Current State | Target State |
|-----------|---------------|--------------|
| **Appointment Status** | Multiple statuses (Medical Done, Pending for Invoice, etc.) | Single status: "Medical Done" + Flag system |
| **Invoice Status** | Multiple statuses (Draft, Submitted, Approved, etc.) | Two statuses only: Submitted, Cancelled |
| **DC Bill Status** | Multiple statuses | Five statuses: Draft, Disputed, Approved, Cancelled, Paid |

### 2.2 What's NOT Changing
- Core functionality remains the same
- Database structure (add flag columns only)
- User interface layouts
- Business logic (except status-related)

---

## 3. Detailed Requirements

### 3.1 Appointment Changes

#### 3.1.1 Remove Status Changes
- **Current:** Appointments change status (Medical Done → Pending for Invoice → Invoiced)
- **New:** Appointments remain in "Medical Done" status permanently

#### 3.1.2 Add Flag System

**Database Changes:**
```sql
ALTER TABLE appointments ADD COLUMN invoice_id VARCHAR(50) DEFAULT NULL;
ALTER TABLE appointments ADD COLUMN dc_docket_id VARCHAR(50) DEFAULT NULL;

-- Create indexes for performance
CREATE INDEX idx_appointments_invoice_id ON appointments(invoice_id);
CREATE INDEX idx_appointments_dc_docket_id ON appointments(dc_docket_id);
```

**Flag Logic:**
- `invoice_id`: NULL = Not invoiced, Value = Linked to invoice
- `dc_docket_id`: NULL = Not in DC bill, Value = Linked to docket

#### 3.1.3 Search Filter Updates

**Invoice Search - Replace:**
```sql
-- OLD
WHERE status = 'Pending for Invoice'

-- NEW  
WHERE status = 'Medical Done' AND invoice_id IS NULL
```

**DC Bill Search - Replace:**
```sql
-- OLD
WHERE status = 'Pending for DC Bill'

-- NEW
WHERE status = 'Medical Done' AND dc_docket_id IS NULL
```

---

### 3.2 Invoice Status Streamlining

#### 3.2.1 Status Definition

| Status | Code | Description | Can Add Zoho ID | Can Cancel |
|--------|------|-------------|-----------------|------------|
| **Submitted** | SUBMITTED | Default when invoice created | Yes | Yes (if no Zoho ID) |
| **Cancelled** | CANCELLED | Invoice cancelled | No | No |

#### 3.2.2 Status Transition Rules

```javascript
// Invoice Creation
function createInvoice(appointments) {
    invoice.status = 'SUBMITTED';
    appointments.forEach(apt => {
        apt.invoice_id = invoice.id;
    });
}

// Cancel Invoice
function cancelInvoice(invoice) {
    if (invoice.zoho_reference_id) {
        throw new Error("Cannot cancel invoice with Zoho ID");
    }
    
    invoice.status = 'CANCELLED';
    invoice.zoho_reference_id = null;
    
    // Clear appointment flags
    appointments.forEach(apt => {
        apt.invoice_id = null;
    });
}

// Add Zoho Reference
function addZohoReference(invoice, zohoId) {
    if (invoice.status !== 'SUBMITTED') {
        throw new Error("Can only add Zoho ID to submitted invoices");
    }
    invoice.zoho_reference_id = zohoId;
}
```

#### 3.2.3 UI Changes

**Invoice List Status Display:**
- Show only: Submitted, Cancelled
- Remove: Draft, Approved, Pending

**Action Buttons by Status:**
```
Submitted:
- [Add Zoho ID] - Visible if no Zoho ID
- [Cancel] - Visible if no Zoho ID  
- [View] [Download PDF]

Cancelled:
- [View] only
```

---

### 3.3 DC Bill/Docket Status Streamlining

#### 3.3.1 Status Definition

| Status | Code | Description | Transitions To | Terminal |
|--------|------|-------------|----------------|----------|
| **Draft** | DRAFT | Initial creation | Disputed, Approved, Cancelled | No |
| **Disputed** | DISPUTED | Under dispute | Draft, Approved, Cancelled | No |
| **Approved** | APPROVED | Approved for payment | Paid (auto on Zoho ID) | No |
| **Cancelled** | CANCELLED | Cancelled | None | Yes |
| **Paid** | PAID | Payment processed | None | Yes |

#### 3.3.2 Status Transition Logic

```javascript
// Status Transition Map
const transitions = {
    DRAFT: ['DISPUTED', 'APPROVED', 'CANCELLED'],
    DISPUTED: ['DRAFT', 'APPROVED', 'CANCELLED'],
    APPROVED: ['PAID'], // Auto-transition on Zoho ID
    CANCELLED: [],
    PAID: []
};

// Validate Transition
function canTransition(currentStatus, newStatus) {
    return transitions[currentStatus].includes(newStatus);
}

// Status Change Handler
function changeDocketStatus(docket, newStatus) {
    if (!canTransition(docket.status, newStatus)) {
        throw new Error(`Cannot transition from ${docket.status} to ${newStatus}`);
    }
    
    const oldStatus = docket.status;
    docket.status = newStatus;
    
    // Handle status-specific logic
    switch(newStatus) {
        case 'APPROVED':
            linkAppointmentsToDocket(docket);
            break;
        case 'CANCELLED':
            unlinkAppointmentsFromDocket(docket);
            break;
        case 'PAID':
            // This should never be called directly
            throw new Error("Use addZohoReference to mark as PAID");
    }
    
    auditLog('DOCKET_STATUS_CHANGE', {
        docketId: docket.id,
        oldStatus,
        newStatus,
        userId: currentUser.id
    });
}

// Zoho Reference Handler
function addZohoReferenceToDocket(docket, zohoId) {
    if (docket.status !== 'APPROVED') {
        throw new Error("Can only add Zoho ID to approved dockets");
    }
    
    docket.zoho_reference_id = zohoId;
    docket.status = 'PAID'; // Auto-transition
    
    auditLog('DOCKET_PAID', {
        docketId: docket.id,
        zohoId,
        userId: currentUser.id
    });
}

// Link/Unlink Appointments
function linkAppointmentsToDocket(docket) {
    docket.appointments.forEach(apt => {
        apt.dc_docket_id = docket.id;
    });
}

function unlinkAppointmentsFromDocket(docket) {
    docket.appointments.forEach(apt => {
        apt.dc_docket_id = null;
    });
}
```

#### 3.3.3 UI Changes

**Status Dropdown Options by Current Status:**
```javascript
function getAvailableStatuses(currentStatus) {
    switch(currentStatus) {
        case 'DRAFT':
            return [
                {value: 'DISPUTED', label: 'Mark as Disputed'},
                {value: 'APPROVED', label: 'Approve'},
                {value: 'CANCELLED', label: 'Cancel'}
            ];
        case 'DISPUTED':
            return [
                {value: 'DRAFT', label: 'Back to Draft'},
                {value: 'APPROVED', label: 'Approve'},
                {value: 'CANCELLED', label: 'Cancel'}
            ];
        case 'APPROVED':
            return []; // Only Zoho ID addition allowed
        default:
            return []; // Terminal statuses
    }
}
```

**Action Buttons by Status:**
```
Draft:
- [Change Status ▼] [Edit] [Delete] [Add/Remove Appointments]

Disputed:
- [Change Status ▼] [Add Dispute Notes] [Edit Bill Details]

Approved:
- [Add Zoho ID] [View] [Download Bill]

Paid:
- [View] [Download Bill]

Cancelled:
- [View]
```

---

## 4. Database Migration Script

```sql
-- Add flag columns to appointments
ALTER TABLE appointments 
ADD COLUMN invoice_id VARCHAR(50) DEFAULT NULL,
ADD COLUMN dc_docket_id VARCHAR(50) DEFAULT NULL;

-- Add foreign key constraints
ALTER TABLE appointments
ADD CONSTRAINT fk_invoice_id FOREIGN KEY (invoice_id) REFERENCES invoices(id),
ADD CONSTRAINT fk_dc_docket_id FOREIGN KEY (dc_docket_id) REFERENCES dc_dockets(id);

-- Update invoice statuses
UPDATE invoices 
SET status = 'SUBMITTED' 
WHERE status IN ('DRAFT', 'APPROVED', 'PENDING');

-- Update DC docket statuses
UPDATE dc_dockets 
SET status = 'APPROVED' 
WHERE status = 'SUBMITTED';

-- Populate appointment flags based on existing relationships
UPDATE appointments a
JOIN invoice_appointments ia ON a.id = ia.appointment_id
SET a.invoice_id = ia.invoice_id
WHERE a.status = 'INVOICED';

UPDATE appointments a
JOIN docket_appointments da ON a.id = da.appointment_id
SET a.dc_docket_id = da.docket_id
WHERE a.status = 'BILLED';

-- Remove old status columns/values after verification
-- This should be done after thorough testing
```

---

## 5. API Changes

### 5.1 Invoice Endpoints

**GET /api/appointments/available-for-invoice**
```javascript
// Old query
WHERE status = 'Pending for Invoice'

// New query
WHERE status = 'Medical Done' AND invoice_id IS NULL
```

**POST /api/invoices/{id}/cancel**
```javascript
// Add validation
if (invoice.zoho_reference_id) {
    return {
        error: "Cannot cancel invoice with Zoho reference",
        code: "INVOICE_HAS_ZOHO_ID"
    };
}
```

### 5.2 DC Docket Endpoints

**PUT /api/dockets/{id}/status**
```javascript
// Request body
{
    "status": "APPROVED",
    "notes": "Optional status change notes"
}

// Validation
if (!canTransition(docket.status, request.status)) {
    return {
        error: `Invalid transition from ${docket.status} to ${request.status}`,
        code: "INVALID_STATUS_TRANSITION"
    };
}
```

**POST /api/dockets/{id}/zoho-reference**
```javascript
// Auto-transitions to PAID
{
    "zoho_reference_id": "ZOHO-123456"
}
```

---

## 6. Testing Requirements

### 6.1 Invoice Testing Scenarios

1. **Create Invoice → Submitted Status**
   - Verify status is SUBMITTED
   - Verify appointments have invoice_id set

2. **Cancel Invoice (No Zoho ID)**
   - Verify status changes to CANCELLED
   - Verify appointments have invoice_id cleared

3. **Cancel Invoice (With Zoho ID)**
   - Verify error message
   - Verify no status change

4. **Add Zoho ID**
   - Verify only works on SUBMITTED status
   - Verify cannot cancel after adding

### 6.2 DC Docket Testing Scenarios

1. **Status Transitions**
   - Test all valid transitions
   - Test invalid transitions throw errors

2. **Appointment Flag Updates**
   - Approved: Sets dc_docket_id
   - Cancelled: Clears dc_docket_id

3. **Zoho ID → Paid Transition**
   - Verify automatic status change
   - Verify cannot change status after PAID

### 6.3 Search/Filter Testing

1. **Available Appointments**
   - Invoice: Medical Done + no invoice_id
   - DC Bill: Medical Done + no dc_docket_id

2. **Flag-based Filtering**
   - Test all employee history filters
   - Test appointment search filters

---

## 7. Rollback Plan

If issues arise:

1. **Database Rollback**
   ```sql
   -- Restore appointment statuses from flags
   UPDATE appointments 
   SET status = 'INVOICED' 
   WHERE invoice_id IS NOT NULL;
   
   UPDATE appointments 
   SET status = 'BILLED' 
   WHERE dc_docket_id IS NOT NULL;
   
   -- Restore old invoice/docket statuses from backup
   ```

2. **Code Rollback**
   - Git revert to previous version
   - Redeploy previous build

3. **Data Validation**
   - Run reconciliation report
   - Verify no data loss

---

## 8. Success Criteria

1. **No Data Loss**
   - All existing relationships preserved
   - Audit trail maintained

2. **Performance**
   - Search queries perform same or better
   - No UI lag on status changes

3. **User Experience**
   - Clear status options
   - Intuitive transitions
   - Proper error messages

4. **Business Rules**
   - Zoho ID restrictions enforced
   - Terminal statuses respected
   - Flag updates accurate

---

## 9. Timeline

- **Day 1-2:** Database migration and backend changes
- **Day 3-4:** UI updates and integration
- **Day 5:** Testing and bug fixes
- **Day 6:** UAT and deployment preparation
- **Day 7:** Production deployment

---

## 10. Questions for Development Team

1. Are there any batch jobs that depend on appointment statuses?
2. Are there any reports that need status mapping updates?
3. Do we need to maintain old status values for historical reports?
4. Should we add database triggers for flag updates?
5. Any third-party integrations affected by status changes?