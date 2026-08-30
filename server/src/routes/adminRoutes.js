import express from 'express';
import { getAllComplaints, getAdminComplaintDetails, updateComplaintDetails, getDashboardStats } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/complaints', getAllComplaints);
router.get('/complaints/:id', getAdminComplaintDetails);
router.put('/complaints/:id', updateComplaintDetails);
router.get('/statistics', getDashboardStats);

export default router;
