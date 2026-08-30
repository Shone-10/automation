import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import { updateComplaintByAdmin, getComplaintTimeline } from '../services/complaintService.js';
import { checkAndEscalateComplaints } from '../services/escalationService.js';

// @desc    Get all complaints with filters/search
// @route   GET /api/admin/complaints
// @access  Private (Admin)
export const getAllComplaints = async (req, res, next) => {
  try {
    // Run escalation checks
    await checkAndEscalateComplaints();

    const { status, category, priority, department, search, sort } = req.query;
    let query = {};

    // Apply filters
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (department) query.department = department;

    // Apply search (Complaint ID, Title, Student Name)
    if (search) {
      // Find matching users first if search might be student name
      const users = await User.find({ name: { $regex: search, $options: 'i' } });
      const userIds = users.map(u => u._id);

      query.$or = [
        { complaintId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { studentId: { $in: userIds } }
      ];
    }

    // Sorting
    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    else if (sort === 'priority') {
      // Custom priority sort logic or default:
      sortObj = { priority: 1, createdAt: -1 };
    }

    const complaints = await Complaint.find(query)
      .populate('studentId', 'name email department year')
      .sort(sortObj);

    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaint details by ID
// @route   GET /api/admin/complaints/:id
// @access  Private (Admin)
export const getAdminComplaintDetails = async (req, res, next) => {
  try {
    // Run escalation checks
    await checkAndEscalateComplaints();

    const complaint = await Complaint.findById(req.params.id)
      .populate('studentId', 'name email department year studentId');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const timeline = await getComplaintTimeline(complaint._id);
    res.json({ complaint, timeline });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint details / status / assignments
// @route   PUT /api/admin/complaints/:id
// @access  Private (Admin)
export const updateComplaintDetails = async (req, res, next) => {
  try {
    const adminId = req.user._id;
    const complaint = await updateComplaintByAdmin(req.params.id, adminId, req.body);
    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

// Helper function to format duration (ms to human readable)
const formatDuration = (ms) => {
  if (isNaN(ms) || ms < 0) return 'N/A';
  const mins = Math.floor(ms / (60 * 1000));
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  if (days > 0) {
    const remainingHrs = hrs % 24;
    return `${days} day${days > 1 ? 's' : ''} ${remainingHrs} hr${remainingHrs !== 1 ? 's' : ''}`;
  }
  if (hrs > 0) {
    const remainingMins = mins % 60;
    return `${hrs} hr${hrs !== 1 ? 's' : ''} ${remainingMins} min${remainingMins !== 1 ? 's' : ''}`;
  }
  return `${mins} min${mins !== 1 ? 's' : ''}`;
};

// @desc    Get overall dashboard statistics
// @route   GET /api/admin/statistics
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    // Run escalation checks
    await checkAndEscalateComplaints();

    const total = await Complaint.countDocuments();
    const submitted = await Complaint.countDocuments({ status: 'Submitted' });
    const underReview = await Complaint.countDocuments({ status: 'Under Review' });
    const assigned = await Complaint.countDocuments({ status: 'Assigned' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const closed = await Complaint.countDocuments({ status: 'Closed' });
    const critical = await Complaint.countDocuments({ priority: 'Critical', status: { $nin: ['Resolved', 'Closed'] } });
    const escalated = await Complaint.countDocuments({ isEscalated: true, status: { $nin: ['Resolved', 'Closed'] } });

    // Category distribution
    const categoryAggregation = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const categories = categoryAggregation.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    // Priority distribution
    const priorityAggregation = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    const priorities = priorityAggregation.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    // Status distribution
    const statusAggregation = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const statuses = statusAggregation.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    // Department-wise statistics
    const departmentsList = [
      'Administration',
      'IT Department',
      'Maintenance',
      'Hostel',
      'Transportation',
      'Housekeeping',
      'Laboratory'
    ];

    const departmentStats = [];
    for (const dept of departmentsList) {
      const deptTotal = await Complaint.countDocuments({ department: dept });
      const deptPending = await Complaint.countDocuments({
        department: dept,
        status: { $in: ['Submitted', 'Under Review', 'Assigned', 'In Progress'] }
      });
      const deptResolved = await Complaint.countDocuments({
        department: dept,
        status: { $in: ['Resolved', 'Closed'] }
      });

      departmentStats.push({
        department: dept,
        total: deptTotal,
        pending: deptPending,
        resolved: deptResolved
      });
    }

    // Resolution Time metrics
    const resolvedComplaints = await Complaint.find({
      status: { $in: ['Resolved', 'Closed'] },
      resolvedAt: { $exists: true }
    });

    let totalDurationMs = 0;
    let fastestMs = Infinity;
    let longestMs = -Infinity;

    resolvedComplaints.forEach((comp) => {
      const duration = new Date(comp.resolvedAt) - new Date(comp.createdAt);
      if (duration > 0) {
        totalDurationMs += duration;
        if (duration < fastestMs) fastestMs = duration;
        if (duration > longestMs) longestMs = duration;
      }
    });

    const averageMs = resolvedComplaints.length > 0 ? totalDurationMs / resolvedComplaints.length : 0;
    const avgText = resolvedComplaints.length > 0 ? formatDuration(averageMs) : 'N/A';
    const fastText = resolvedComplaints.length > 0 ? formatDuration(fastestMs) : 'N/A';
    const longText = resolvedComplaints.length > 0 ? formatDuration(longestMs) : 'N/A';

    res.json({
      summary: {
        total,
        submitted,
        underReview,
        assigned,
        inProgress,
        pending: submitted + underReview + assigned + inProgress,
        resolved,
        closed,
        critical,
        escalated
      },
      charts: {
        categories,
        priorities,
        statuses
      },
      departmentStats,
      resolutionTimes: {
        avg: avgText,
        fastest: fastText,
        longest: longText
      }
    });
  } catch (error) {
    next(error);
  }
};
