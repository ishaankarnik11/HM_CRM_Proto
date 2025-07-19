# Accounting API Documentation

This document describes the API endpoints for the MyHealthMeter CRM Accounting Module.

## Overview

The Accounting API provides endpoints for managing invoices, DC bills, and related master data. Currently implemented as a mock service that can be easily replaced with actual backend API calls.

## API Endpoints

### Invoice Management

#### Search Appointments
```typescript
GET /api/appointments/search
```
Search for appointments eligible for invoicing.

**Parameters:**
- `startDate`: string (required) - Start date for search
- `endDate`: string (required) - End date for search  
- `corporateId`: string (required) - Corporate client ID
- `serviceType`: string (optional) - Filter by service type

**Response:**
```typescript
Appointment[]
```

#### Create Invoice
```typescript
POST /api/invoices
```
Create a new pro-forma invoice.

**Body:**
```typescript
{
  corporate: string;
  corporateId: string;
  selectedPO: PurchaseOrder;
  appointments: Appointment[];
  subtotal: number;
  gstAmount: number;
  total: number;
}
```

**Response:**
```typescript
Invoice
```

#### Get Invoices
```typescript
GET /api/invoices
```
Retrieve invoices with optional filtering.

**Query Parameters:**
- `corporate`: string (optional) - Filter by corporate name
- `status`: string (optional) - Filter by invoice status
- `startDate`: string (optional) - Filter by creation date
- `endDate`: string (optional) - Filter by creation date

**Response:**
```typescript
Invoice[]
```

#### Update Invoice Status
```typescript
PATCH /api/invoices/:id/status
```
Update invoice status.

**Body:**
```typescript
{
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue'
}
```

**Response:**
```typescript
Invoice
```

### DC Bills Management

#### Search DC Appointments
```typescript
GET /api/dc-appointments/search
```
Search for appointments at diagnostic centers.

**Parameters:**
- `diagnosticCenterId`: string (required) - Diagnostic center ID
- `location`: string (required) - Location name
- `startDate`: string (required) - Start date for search
- `endDate`: string (required) - End date for search

**Response:**
```typescript
Appointment[]
```

#### Create DC Bill
```typescript
POST /api/dc-bills
```
Create a new DC bill/docket.

**Body:**
```typescript
{
  diagnosticCenter: string;
  location: string;
  appointmentIds: string[];
  billFile?: File;
}
```

**Response:**
```typescript
DCBill
```

#### Get DC Bills
```typescript
GET /api/dc-bills
```
Retrieve DC bills with optional filtering.

**Query Parameters:**
- `diagnosticCenter`: string (optional) - Filter by DC name
- `location`: string (optional) - Filter by location
- `status`: string (optional) - Filter by bill status

**Response:**
```typescript
DCBill[]
```

#### Update DC Bill Status
```typescript
PATCH /api/dc-bills/:id/status
```
Update DC bill status.

**Body:**
```typescript
{
  status: 'Draft' | 'Submitted' | 'Approved' | 'Paid'
}
```

**Response:**
```typescript
DCBill
```

### Master Data

#### Get Corporates
```typescript
GET /api/corporates
```
Retrieve all corporate clients.

**Response:**
```typescript
Corporate[]
```

#### Get Diagnostic Centers
```typescript
GET /api/diagnostic-centers
```
Retrieve all diagnostic centers.

**Response:**
```typescript
DiagnosticCenter[]
```

#### Get Purchase Orders
```typescript
GET /api/corporates/:id/purchase-orders
```
Retrieve purchase orders for a corporate client.

**Response:**
```typescript
PurchaseOrder[]
```

## Data Models

### Invoice
```typescript
interface Invoice {
  id: string;
  invoiceNumber: string;
  corporate: string;
  corporateId: string;
  selectedPO?: PurchaseOrder;
  appointments: Appointment[];
  subtotal: number;
  gstAmount: number;
  total: number;
  createdDate: string;
  dueDate: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  createdBy: string;
}
```

### Appointment
```typescript
interface Appointment {
  id: string;
  employeeName: string;
  employeeId: string;
  corporate: string;
  corporateId: string;
  appointmentDate: string;
  serviceRate: number;
  packageType: 'AHC' | 'PEC' | 'OPD';
  serviceType: string;
  status: 'Medical Done' | 'Pending' | 'Cancelled';
  age?: number;
  gender?: 'M' | 'F';
}
```

### DCBill
```typescript
interface DCBill {
  id: string;
  docketNumber: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Paid';
  diagnosticCenter: string;
  location: string;
  period: string;
  appointmentIds: string[];
  count: number;
  amount: number;
  createdDate: string;
  submittedDate?: string;
  billFile?: {
    name: string;
    url: string;
    size: number;
  };
}
```

### Corporate
```typescript
interface Corporate {
  id: string;
  name: string;
  active: boolean;
  address: string;
  gstin: string;
  purchaseOrders: PurchaseOrder[];
}
```

### PurchaseOrder
```typescript
interface PurchaseOrder {
  id: string;
  number: string;
  balance: number;
  total: number;
  validUntil: string;
}
```

### DiagnosticCenter
```typescript
interface DiagnosticCenter {
  id: string;
  name: string;
  locations: string[];
  active: boolean;
}
```

## Error Handling

All API endpoints return standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

Error responses follow this format:
```typescript
{
  error: {
    message: string;
    code: string;
    details?: any;
  }
}
```

## Authentication & Authorization

API endpoints require authentication headers:
```
Authorization: Bearer <token>
```

Role-based access control:
- **Finance Manager**: Full access to all endpoints
- **Accounts Payable Clerk**: Access to DC bills and read-only invoice access
- **Admin**: Full access with additional configuration endpoints

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per minute for authenticated users
- 1000 requests per hour for the same IP address

## Implementation Notes

### Current Implementation
- Mock service with in-memory data storage
- Simulated API delays for realistic behavior
- Full TypeScript support

### Production Considerations
- Replace mock service with actual HTTP client (axios/fetch)
- Add proper error handling and retry logic
- Implement request/response interceptors
- Add logging and monitoring
- Use environment variables for API base URLs
- Add request caching and optimization

### Migration Path
1. Replace `AccountingAPIService` methods with actual HTTP calls
2. Update error handling to match backend error format
3. Add authentication token management
4. Configure API base URLs for different environments
5. Add request/response transformers if needed

## Usage Examples

### React Component Integration
```typescript
import { useSearchAppointments, useCreateInvoice } from '../hooks/useAccounting';

const InvoiceCreator = () => {
  const { data: appointments, isLoading } = useSearchAppointments({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    corporateId: '1'
  });

  const createInvoice = useCreateInvoice();

  const handleCreateInvoice = async (invoiceData) => {
    try {
      await createInvoice.mutateAsync(invoiceData);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
};
```

### Direct API Usage
```typescript
import { accountingAPI } from '../services/api';

// Search appointments
const appointments = await accountingAPI.searchAppointments({
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  corporateId: '1'
});

// Create invoice
const invoice = await accountingAPI.createInvoice({
  corporate: 'TechCorp India',
  corporateId: '1',
  appointments: selectedAppointments,
  subtotal: 5000,
  gstAmount: 900,
  total: 5900
});
```