import express from 'express';
import { protect, authorize } from '../../middlewares/auth';
import {
  createNotification,
  getUserNotifications,
  markAsRead
} from './notification.controller';

const router = express.Router();

// Admin/staff can create notifications
router.post('/create', protect, authorize('admin','staff'), createNotification);

// Users can view their notifications
router.get('/me', protect, getUserNotifications);

// Mark notification as read
router.post('/read', protect, markAsRead);

export default router;