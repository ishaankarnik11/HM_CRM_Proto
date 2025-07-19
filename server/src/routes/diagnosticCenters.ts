import express from 'express';
import { DiagnosticCenterController } from '../controllers/diagnosticCenterController';

const router = express.Router();
const diagnosticCenterController = new DiagnosticCenterController();

// GET /api/diagnostic-centers - Get all diagnostic centers
router.get('/', diagnosticCenterController.getDiagnosticCenters);

// GET /api/diagnostic-centers/:id - Get single diagnostic center by ID
router.get('/:id', diagnosticCenterController.getDiagnosticCenterById);

// POST /api/diagnostic-centers - Create new diagnostic center
router.post('/', diagnosticCenterController.createDiagnosticCenter);

// PATCH /api/diagnostic-centers/:id - Update diagnostic center
router.patch('/:id', diagnosticCenterController.updateDiagnosticCenter);

// DELETE /api/diagnostic-centers/:id - Delete diagnostic center
router.delete('/:id', diagnosticCenterController.deleteDiagnosticCenter);

export default router;