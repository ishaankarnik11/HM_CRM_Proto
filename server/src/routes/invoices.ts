import express from 'express';
import { InvoiceController } from '../controllers/invoiceController';

const router = express.Router();
const invoiceController = new InvoiceController();

// GET /api/invoices - Get all invoices with optional filters
router.get('/', invoiceController.getInvoices);

// GET /api/invoices/:id - Get single invoice by ID
router.get('/:id', invoiceController.getInvoiceById);

// POST /api/invoices - Create new invoice
router.post('/', invoiceController.createInvoice);

// PATCH /api/invoices/:id/status - Update invoice status
router.patch('/:id/status', invoiceController.updateInvoiceStatus);

// DELETE /api/invoices/:id - Delete invoice
router.delete('/:id', invoiceController.deleteInvoice);

export default router;