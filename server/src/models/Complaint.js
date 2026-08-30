import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Classroom',
        'Laboratory',
        'Hostel',
        'Wi-Fi / Internet',
        'Infrastructure',
        'Transportation',
        'Cleanliness',
        'Other',
      ],
      default: 'Other',
    },
    description: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Low',
    },
    status: {
      type: String,
      enum: [
        'Submitted',
        'Under Review',
        'Assigned',
        'In Progress',
        'Resolved',
        'Closed',
      ],
      default: 'Submitted',
    },
    department: {
      type: String,
      enum: [
        'Administration',
        'IT Department',
        'Maintenance',
        'Hostel',
        'Transportation',
        'Housekeeping',
        'Laboratory',
        '',
      ],
      default: '',
    },
    assignedStaff: {
      type: String,
      default: '',
    },
    adminComment: {
      type: String,
      default: '',
    },
    resolutionDetails: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
    },
    isEscalated: {
      type: Boolean,
      default: false,
    },
    escalatedAt: {
      type: Date,
    },
    feedback: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for search
complaintSchema.index({ complaintId: 'text', title: 'text' });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
