import express from 'express';
import multer from 'multer';
import { DCBillController } from '../controllers/dcBillController';

const router = express.Router();
const dcBillController = new DCBillController();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/dc-bills/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image, PDF, and document files are allowed'));
    }
  }
});

// GET /api/dc-bills - Get all DC bills with optional filters
router.get('/', dcBillController.getDCBills);

// GET /api/dc-bills/:id - Get single DC bill by ID
router.get('/:id', dcBillController.getDCBillById);

// POST /api/dc-bills - Create new DC bill
router.post('/', upload.single('billFile'), dcBillController.createDCBill);

// PATCH /api/dc-bills/:id/status - Update DC bill status
router.patch('/:id/status', dcBillController.updateDCBillStatus);

// DELETE /api/dc-bills/:id - Delete DC bill
router.delete('/:id', dcBillController.deleteDCBill);

export default router;