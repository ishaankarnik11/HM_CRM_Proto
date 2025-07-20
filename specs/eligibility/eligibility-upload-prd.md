# Product Requirements Document - Upload Eligibility Module

## 1. Executive Summary

The Upload Eligibility module enables HR administrators to bulk manage employee eligibility data through file uploads. The system supports three operational modes (Add, Remove, Update) with comprehensive validation, duplicate detection, and transaction logging. This PRD ensures complete parity between the employee listing screen columns and upload file structure.

## 2. Product Overview

### 2.1 Purpose
Enable efficient bulk management of employee eligibility data while maintaining data integrity and providing clear feedback on processing results.

### 2.2 Objectives
- Streamline employee onboarding/offboarding processes
- Ensure data consistency across the platform
- Provide comprehensive validation and error handling
- Maintain complete audit trail of all operations

### 2.3 User Personas
- **HR Administrators:** Primary users managing employee eligibility
- **Finance Teams:** Secondary users requiring accurate employee data for billing
- **IT Support:** Technical users troubleshooting upload issues

## 3. Feature Requirements

### 3.1 Mode Selection

#### User Interface
Three mutually exclusive radio button options:
- **Add Employees:** Onboard new employees to eligibility system
- **Remove Employees:** Soft-delete employees from eligibility
- **Update Employees:** Modify existing employee attributes

#### Business Logic
- Mode selection determines validation rules applied
- Mode affects required/optional field enforcement
- Mode determines output file format and content

### 3.2 File Upload Interface

#### Upload Component Requirements
- **Drag-and-drop zone** with visual feedback
- **Browse button** as alternative upload method
- **File type validation:** XLSX, CSV only
- **File size limit:** 10MB maximum
- **Progress indicator** during file processing
- **Clear visual states:** Ready, Uploading, Processing, Complete, Error

#### Template Management
- **Download template button** prominent placement
- **Template includes all columns** with example data
- **Format guidance document** accessible via help icon
- **Version control** for template updates

### 3.3 Column Structure and Field Parity

The upload file must maintain complete parity with the employee listing screen. All columns visible in the employee table must be available in the upload file.

#### Core Employee Data Columns

| Column Name | Required | Data Type | Validation Rules | Employee List Display |
|-------------|----------|-----------|------------------|----------------------|
| Emp ID | Yes | String | Unique within corporate, alphanumeric | Yes - Primary identifier |
| Name | Yes | String | Non-empty, max 100 chars | Yes - Full name display |
| Email | Yes | Email | Valid format, unique within corporate | Yes - Contact email |
| Mobile | Conditional* | String | 10 digits, numeric only | Yes - Contact number |
| DOB | No | Date | Format: DD/MM/YYYY, ≤ today | No - Privacy consideration |
| DOJ | Yes | Date | Format: DD/MM/YYYY, ≤ today | No - Internal data |

*Required if passcode delivery needed

#### Organizational Data Columns

| Column Name | Required | Data Type | Validation Rules | Employee List Display |
|-------------|----------|-----------|------------------|----------------------|
| Corporate | Yes | String | Must match selected corporate | No - Context implicit |
| Entity | Conditional* | String | Valid entity under corporate | No - Billing data |
| Location | No | String | Valid location from master | Yes - Work location |
| Designation | No | String | Max 100 chars | Yes - Job title |
| Cost Center | No | String | For billing segmentation | No - Finance data only |

*Required for billing processes

#### HR Contact Columns

| Column Name | Required | Data Type | Validation Rules | Employee List Display |
|-------------|----------|-----------|------------------|----------------------|
| HR Name | Conditional* | String | Max 100 chars | No - Administrative data |
| HR Email | Conditional* | Email | Valid email format | No - Administrative data |

*Required for billing and communication

#### Dependent Information Columns

| Column Name | Required | Data Type | Validation Rules | Employee List Display |
|-------------|----------|-----------|------------------|----------------------|
| Dependent Count | No | Number | Integer ≥ 0, default: 0 | No - Benefits data |
| Dependent Type | No | Enum | None/Spouse/Parents/Children/Multiple | No - Benefits data |

#### Status and Benefits Columns (Read from System)

These columns appear in the employee list but are system-generated:

| Column Name | Source | Employee List Display |
|-------------|--------|----------------------|
| AHC Benefit Status | System calculated | Yes - Badge display |
| Benefit Source | Rule engine/Group assignment | Yes - Source name |
| Next AHC Date | Calculated from rules | Yes - Eligibility date |
| Last AHC Date | Historical data | Yes - Previous check |
| Passcode Status | Delivery tracking | Yes - Status badge |
| Employee Status | Upload/Edit operations | Yes - Active/Inactive |

### 3.4 Validation Rules

#### Schema Validation (Pre-processing)
1. **File format validation**
   - Correct file extension (.xlsx, .csv)
   - Valid file structure
   - Readable content

2. **Column validation**
   - All required columns present
   - Column names exact match (case-insensitive)
   - No duplicate column names

3. **Data type validation**
   - Dates in correct format
   - Numbers are numeric
   - Emails follow RFC 5322

#### Business Rules Validation

##### Add Mode Validations
- Employee ID unique within corporate
- Email unique within corporate
- Mobile unique if provided (within corporate)
- DOJ ≤ current date
- DOB ≤ current date if provided
- Entity exists under selected corporate
- Location exists in location master

##### Remove Mode Validations
- Employee exists in system
- Employee belongs to selected corporate
- Check for completed AHC appointments

##### Update Mode Validations
- Employee exists (by ID or Email)
- New values follow same rules as Add mode
- Cannot change Employee ID
- Email uniqueness if changing email

#### Duplicate Detection Logic

##### Within File
- Check for duplicate Employee IDs
- Check for duplicate Email addresses
- Check for duplicate Mobile numbers (if provided)
- Report row numbers for duplicates

##### Against Database (Add Mode)
- Query existing active employees
- Scope: Current corporate + active term
- Check Employee ID, Email, Mobile
- Provide specific conflict details

### 3.5 Processing Logic

#### Add Mode Processing

##### Success Path
1. Create employee eligibility record
2. Set status as "Active"
3. Generate eligibility start date (current date)
4. Apply corporate rules immediately
5. Check OPD benefit eligibility
6. Create comprehensive audit log entry
7. Queue for passcode generation (if mobile provided)

##### Failure Handling
1. Capture specific validation error
2. Continue processing remaining rows
3. Aggregate errors by type
4. Generate detailed failure report

#### Remove Mode Processing

##### Success Path
1. Locate employee record
2. Check for AHC appointment history
3. Update status to "Inactive"
4. Preserve all historical data
5. Remove from rule evaluations
6. Create audit log with removal reason
7. Trigger deactivation notifications

##### Special Handling
- If AHC taken in current term, flag in output
- Maintain appointment history
- Keep employee in reports

#### Update Mode Processing

##### Success Path
1. Match employee by key (ID or Email)
2. Update only provided fields
3. Preserve unchanged fields
4. Re-evaluate rule eligibility if criteria fields change
5. Update modified timestamp
6. Create detailed audit log
7. Trigger relevant notifications

##### Field Update Rules
- Null/empty values: Keep existing
- Provided values: Update field
- System fields: Never update via upload

### 3.6 Output File Specifications

#### Success File Format

##### Filename Pattern
`eligibility_{mode}_success_YYYYMMDD_HHMMSS.csv`

##### Add Mode Success Columns
- All uploaded columns
- Status: "Added"
- Eligibility Start Date
- Assigned Rule (if applicable)
- OPD Benefits (if applicable)
- Processing Timestamp

##### Remove Mode Success Columns
- All uploaded columns
- Status: "Removed"
- Appointment ID (if exists)
- AHC Date (if taken)
- AlreadyTakenAHC: Yes/No
- Removal Timestamp

##### Update Mode Success Columns
- All uploaded columns
- Status: "Updated"
- Fields Updated (comma-separated list)
- Previous Values (JSON)
- Update Timestamp

#### Failure File Format

##### Filename Pattern
`eligibility_{mode}_failure_YYYYMMDD_HHMMSS.csv`

##### All Modes Failure Columns
- All uploaded columns
- Remarks (detailed error message)
- Row Number (from upload file)
- Validation Type (Schema/Business/Duplicate)
- Field Name (if field-specific error)

### 3.7 User Experience Flow

#### Step-by-Step Process

1. **Mode Selection**
   - User selects operation mode
   - System updates UI labels accordingly
   - Help text updates for mode context

2. **Template Preparation**
   - Optional template download
   - System provides mode-specific template
   - Includes sample data row

3. **File Selection**
   - Drag-drop or browse for file
   - Immediate file validation
   - Show file name and size

4. **Upload Initiation**
   - Upload button enables after file selection
   - Confirmation dialog for large files
   - Progress tracking begins

5. **Processing Feedback**
   - Full-screen processing overlay
   - Animated progress indicator
   - Estimated time remaining (if possible)

6. **Results Display**
   - Success count with green indicator
   - Failure count with red indicator
   - Warning count with yellow indicator (future)

7. **File Downloads**
   - Success file always available
   - Failure file only if errors exist
   - Clear download buttons with icons

8. **Post-Processing**
   - Option to upload another file
   - Link to view affected employees
   - Summary email to uploader

### 3.8 Error Handling

#### Validation Error Messages

##### Field-Level Errors
- "Employee ID is required"
- "Email format is invalid: {email}"
- "Mobile must be 10 digits: {mobile}"
- "Date of Joining cannot be future date"
- "Employee ID already exists: {id}"

##### Row-Level Errors
- "Duplicate employee ID in row {n}"
- "Employee not found: {id}"
- "Multiple errors in row {n}: {errors}"

##### File-Level Errors
- "File exceeds 10MB limit"
- "Invalid file format. Use XLSX or CSV"
- "Missing required columns: {columns}"
- "File is empty or corrupted"

#### System Error Handling
- Connection timeout: Retry mechanism
- Server error: Graceful failure with support contact
- Partial processing: Clear status of what succeeded

### 3.9 Business Rules

#### Employee Eligibility Rules
1. Employees must belong to selected corporate
2. Inactive employees excluded from rule evaluation
3. One employee can have only one active eligibility per term
4. Email and Employee ID must be unique within corporate

#### Data Integrity Rules
1. All dates must use DD/MM/YYYY format
2. Mobile numbers must be 10 digits without country code
3. Email addresses must follow standard format
4. Employee ID cannot contain special characters

#### Processing Rules
1. Process all rows even if some fail
2. Validate entire file before processing
3. Generate audit log for every operation
4. Success file includes all successfully processed rows

