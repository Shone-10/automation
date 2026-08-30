import Notification from '../models/Notification.js';
import { emitToUser, emitToAdmins } from '../sockets/socketHandler.js';

/**
 * Creates a notification in the database and sends it in real-time if a Socket.IO connection is active.
 */
export const createNotification = async ({ userId, complaintId, type, title, message }) => {
  try {
    const notification = await Notification.create({
      userId,
      complaintId,
      type,
      title,
      message,
      isRead: false,
    });

    // Send real-time notification via Socket.IO
    emitToUser(userId, 'notification:new', {
      _id: notification._id,
      complaintId,
      type,
      title,
      message,
      isRead: false,
      createdAt: notification.createdAt,
    });

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error.message);
    return null;
  }
};

/**
 * Notify all admins about a new complaint or update
 */
export const notifyAdmins = async ({ complaintId, type, title, message }) => {
  // Broadly emits socket event to admin channel
  emitToAdmins('notification:new', {
    complaintId,
    type,
    title,
    message,
    createdAt: new Date(),
  });
};
