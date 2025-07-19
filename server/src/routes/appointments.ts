import express from 'express';
import { AppointmentController } from '../controllers/appointmentController';

const router = express.Router();
const appointmentController = new AppointmentController();

// GET /api/appointments/search - Search appointments for invoice generation
router.get('/search', appointmentController.searchAppointments);

// GET /api/appointments/dc-search - Search appointments for DC bills
router.get('/dc-search', appointmentController.searchDCAppointments);

// GET /api/appointments/:id - Get single appointment by ID
router.get('/:id', appointmentController.getAppointmentById);

// POST /api/appointments - Create new appointment
router.post('/', appointmentController.createAppointment);

// PATCH /api/appointments/:id - Update appointment
router.patch('/:id', appointmentController.updateAppointment);

// DELETE /api/appointments/:id - Delete appointment
router.delete('/:id', appointmentController.deleteAppointment);

export default router;