import express from 'express';
import { CorporateController } from '../controllers/corporateController';

const router = express.Router();
const corporateController = new CorporateController();

// GET /api/corporates - Get all corporates
router.get('/', corporateController.getCorporates);

// GET /api/corporates/:id - Get single corporate by ID
router.get('/:id', corporateController.getCorporateById);

// GET /api/corporates/:id/purchase-orders - Get purchase orders for a corporate
router.get('/:id/purchase-orders', corporateController.getPurchaseOrders);

// POST /api/corporates - Create new corporate
router.post('/', corporateController.createCorporate);

// PATCH /api/corporates/:id - Update corporate
router.patch('/:id', corporateController.updateCorporate);

// DELETE /api/corporates/:id - Delete corporate
router.delete('/:id', corporateController.deleteCorporate);

export default router;