import Complaint from '../models/Complaint.js';
import { createNotification } from './notificationService.js';
import User from '../models/User.js';

const ESCALATION_THRESHOLDS = {
  Critical: 24 * 60 * 60 * 1000, // 24 hours
  High: 48 * 60 * 60 * 1000,     // 48 hours
  Medium: 72 * 60 * 60 * 1000,   // 72 hours
  Low: 7 * 24 * 60 * 60 * 1000,  // 7 days
};

/**
 * Scans unresolved complaints, escalates them if thresholds are exceeded, and creates admin notifications.
 */
export const checkAndEscalateComplaints = async () => {
  try {
    const unresolvedComplaints = await Complaint.find({
      status: { $nin: ['Resolved', 'Closed'] },
      isEscalated: false,
    });

    const now = new Date();
    let escalatedCount = 0;

    for (const comp of unresolvedComplaints) {
      const threshold = ESCALATION_THRESHOLDS[comp.priority] || ESCALATION_THRESHOLDS.Low;
      const ageMs = now - new Date(comp.createdAt);

      if (ageMs > threshold) {
        comp.isEscalated = true;
        comp.escalatedAt = now;
        await comp.save();
        escalatedCount++;

        // Notify Admins
        const admins = await User.find({ role: 'admin' });
        for (const admin of admins) {
          await createNotification({
            userId: admin._id,
            complaintId: comp._id,
            type: 'complaint:escalated',
            title: `⚠ Escalation: ${comp.complaintId}`,
            message: `Complaint ${comp.complaintId} ("${comp.title}") has exceeded its resolution threshold for ${comp.priority} priority.`,
          });
        }
      }
    }

    if (escalatedCount > 0) {
      console.log(`Escalated ${escalatedCount} complaints.`);
    }
  } catch (error) {
    console.error('Escalation check error:', error.message);
  }
};
