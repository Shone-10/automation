import Complaint from '../models/Complaint.js';
import ComplaintUpdate from '../models/ComplaintUpdate.js';
import { createComplaint, getComplaintTimeline } from '../services/complaintService.js';
import { checkAndEscalateComplaints } from '../services/escalationService.js';

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (Student)
export const submitComplaint = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const result = await createComplaint(studentId, req.body);
    
    if (result.isDuplicateWarning) {
      return res.status(200).json({
        isDuplicateWarning: true,
        duplicateDetails: result.duplicateDetails
      });
    }

    res.status(201).json(result.complaint);
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's own complaints
// @route   GET /api/complaints/my
// @access  Private (Student)
export const getMyComplaints = async (req, res, next) => {
  try {
    // Run escalation checks
    await checkAndEscalateComplaints();

    const studentId = req.user._id;
    const complaints = await Complaint.find({ studentId }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaint details by ID
// @route   GET /api/complaints/:id
// @access  Private (Student)
export const getMyComplaintDetails = async (req, res, next) => {
  try {
    // Run escalation checks
    await checkAndEscalateComplaints();

    const studentId = req.user._id;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Ensure it belongs to the logged-in student
    if (complaint.studentId.toString() !== studentId.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    const timeline = await getComplaintTimeline(complaint._id);
    res.json({ complaint, timeline });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit feedback/rating on resolved complaint
// @route   POST /api/complaints/:id/feedback
// @access  Private (Student)
export const submitFeedback = async (req, res, next) => {
  const { rating, feedback } = req.body;

  try {
    const studentId = req.user._id;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.studentId.toString() !== studentId.toString()) {
      return res.status(403).json({ message: 'Not authorized to submit feedback' });
    }

    if (complaint.status !== 'Resolved') {
      return res.status(400).json({ message: 'Feedback can only be submitted for Resolved complaints' });
    }

    if (complaint.rating) {
      return res.status(400).json({ message: 'Feedback has already been submitted for this complaint' });
    }

    complaint.rating = rating;
    complaint.feedback = feedback;
    complaint.status = 'Closed'; // Automatically close after feedback is received
    await complaint.save();

    // Create timeline log
    await ComplaintUpdate.create({
      complaintId: complaint._id,
      adminId: studentId,
      message: `Student provided rating: ${rating} stars. Optional Feedback: "${feedback}". Status changed to Closed.`,
      status: 'Closed',
    });

    res.json({ message: 'Feedback submitted successfully', complaint });
  } catch (error) {
    next(error);
  }
};
