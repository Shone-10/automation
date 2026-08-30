import Complaint from '../models/Complaint.js';
import ComplaintUpdate from '../models/ComplaintUpdate.js';
import User from '../models/User.js';
import { checkDuplicate } from './duplicateService.js';
import { suggestCategory, summarizeComplaint, classifyImage } from './aiService.js';
import { createNotification, notifyAdmins } from './notificationService.js';
import { sendEmail } from './emailService.js';

/**
 * Generates a unique human-readable ID, e.g., CMP-001, CMP-002
 */
export const generateComplaintId = async () => {
  const count = await Complaint.countDocuments();
  return `CMP-${String(count + 1).padStart(3, '0')}`;
};

/**
 * Creates a complaint with initial checks (AI category, AI summary, duplicate warnings)
 */
export const createComplaint = async (studentId, complaintData) => {
  const { title, description, location, imageUrl, skipDuplicateCheck } = complaintData;

  // 1. Check for duplicates (only if not explicitly skipped by user proceeding)
  if (!skipDuplicateCheck) {
    const dupCheck = await checkDuplicate({
      category: complaintData.category || 'Other',
      location,
      title,
      description
    });
    
    if (dupCheck.isDuplicate) {
      return { isDuplicateWarning: true, duplicateDetails: dupCheck.duplicateComplaint };
    }
  }

  // 2. AI Suggestions
  let category = complaintData.category;
  if (!category || category === 'Other') {
    category = await suggestCategory(description);
  }
  
  const summary = await summarizeComplaint(description);
  const aiImageClass = imageUrl ? await classifyImage(imageUrl) : 'No Image';

  // 3. Save to database
  const complaintId = await generateComplaintId();
  const complaint = await Complaint.create({
    complaintId,
    studentId,
    title,
    category,
    description,
    summary,
    location,
    imageUrl,
    priority: 'Low',
    status: 'Submitted',
  });

  // 4. Initial Timeline Update
  await ComplaintUpdate.create({
    complaintId: complaint._id,
    adminId: studentId, // Student creates it, so we reference them as initiator (or just flag student role)
    message: 'Complaint submitted and registered in the system.',
    status: 'Submitted',
  });

  // 5. Notify Student
  await createNotification({
    userId: studentId,
    complaintId: complaint._id,
    type: 'complaint:created',
    title: `Complaint Submitted: ${complaintId}`,
    message: `Your complaint about "${title}" has been successfully logged.`,
  });

  // 6. Notify Admins
  const admins = await User.find({ role: 'admin' });
  for (const admin of admins) {
    await createNotification({
      userId: admin._id,
      complaintId: complaint._id,
      type: 'complaint:created',
      title: `New Complaint: ${complaintId}`,
      message: `A new complaint titled "${title}" has been submitted in category ${category}.`,
    });
  }
  
  notifyAdmins({
    complaintId: complaint._id,
    type: 'complaint:created',
    title: `New Complaint: ${complaintId}`,
    message: `A new complaint titled "${title}" has been submitted.`,
  });

  // 7. Send confirmation email to student
  const student = await User.findById(studentId);
  if (student && student.email) {
    sendEmail({
      to: student.email,
      subject: `Complaint Registered - ${complaintId}`,
      text: `Hello ${student.name},\n\nYour complaint titled "${title}" has been registered successfully. Track status here using ID: ${complaintId}.\n\nRegards,\nCollege Admin`,
    });
  }

  return { complaint };
};

/**
 * Updates a complaint details (Admin dashboard/operations)
 */
export const updateComplaintByAdmin = async (complaintId, adminId, updates) => {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) throw new Error('Complaint not found');

  const { status, priority, department, assignedStaff, adminComment, resolutionDetails } = updates;
  const oldStatus = complaint.status;

  // Apply updates
  if (priority) complaint.priority = priority;
  if (department !== undefined) complaint.department = department;
  if (assignedStaff !== undefined) complaint.assignedStaff = assignedStaff;
  
  let statusChanged = false;
  if (status && status !== oldStatus) {
    complaint.status = status;
    statusChanged = true;
    
    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
      if (resolutionDetails) {
        complaint.resolutionDetails = resolutionDetails;
      }
    }
  }

  // Admin comment
  if (adminComment) {
    complaint.adminComment = adminComment;
  }
  
  if (resolutionDetails && status === 'Resolved') {
    complaint.resolutionDetails = resolutionDetails;
  }

  await complaint.save();

  // Create timeline update
  let updateMessage = '';
  if (statusChanged) {
    updateMessage += `Status changed to ${status}. `;
  }
  if (department) {
    updateMessage += `Assigned to ${department} department. `;
  }
  if (assignedStaff) {
    updateMessage += `Staff "${assignedStaff}" assigned. `;
  }
  if (adminComment) {
    updateMessage += `Admin Update: "${adminComment}". `;
  }
  if (status === 'Resolved' && resolutionDetails) {
    updateMessage += `Resolved with details: "${resolutionDetails}". `;
  }

  if (updateMessage.trim()) {
    await ComplaintUpdate.create({
      complaintId: complaint._id,
      adminId,
      message: updateMessage.trim(),
      status: status || oldStatus,
    });
  }

  // Notify student
  await createNotification({
    userId: complaint.studentId,
    complaintId: complaint._id,
    type: 'complaint:updated',
    title: `Update on ${complaint.complaintId}`,
    message: `Your complaint status has been updated to "${status || oldStatus}".`,
  });

  // Send Email if status changed
  if (statusChanged) {
    const student = await User.findById(complaint.studentId);
    if (student && student.email) {
      sendEmail({
        to: student.email,
        subject: `Update on Complaint - ${complaint.complaintId}`,
        text: `Hello ${student.name},\n\nYour complaint ${complaint.complaintId} status has been updated to: ${status}.\n\nMessage: ${updateMessage}\n\nRegards,\nCollege Admin`,
      });
    }
  }

  return complaint;
};

/**
 * Fetch timeline logs for a complaint
 */
export const getComplaintTimeline = async (complaintId) => {
  return await ComplaintUpdate.find({ complaintId })
    .populate('adminId', 'name role')
    .sort({ createdAt: 1 });
};
