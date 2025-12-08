import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import ApiError from '../../utils/ApiError';
import Notification from './notification.model';
import mongoose from 'mongoose';

// Define a custom Request type
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role?: string; // optional if you have role-based auth
  };
}

// Create notification
export const createNotification = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { title, message, userIds, type } = req.body;
  if (!title || !message) throw new ApiError(400, 'Missing required fields');

  const notification = await Notification.create({ title, message, userIds, type });
  res.status(201).json({ success: true, data: notification });
});

// Get notifications for logged-in user
export const getUserNotifications = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  const notifications = await Notification.find({ userIds: userId }).sort({ createdAt: -1 });
  res.json({ success: true, data: notifications });
});

// Mark notification as read
export const markAsRead = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { notificationId } = req.body;
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const notification = await Notification.findById(notificationId);
  if (!notification) throw new ApiError(404, 'Notification not found');

  if (!notification.readBy.includes(userId)) {
    notification.readBy.push(userId);
    await notification.save();
  }

  res.json({ success: true, data: notification });
});
