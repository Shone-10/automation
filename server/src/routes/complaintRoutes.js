import express from 'express';
import { submitComplaint, getMyComplaints, getMyComplaintDetails, submitFeedback } from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('student'), submitComplaint);
router.get('/my', authorize('student'), getMyComplaints);
router.get('/:id', authorize('student'), getMyComplaintDetails);
router.post('/:id/feedback', authorize('student'), submitFeedback);

export default router;
