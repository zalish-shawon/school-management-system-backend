import express from 'express';
import { protect, authorize } from '../../middlewares/auth';
import {
  getStudentPerformanceReport,
  getStudentAttendanceReport,
  getLibraryUsageReport,
  getDashboardSummary
} from './reports.controller';

const router = express.Router();

// Student reports
router.get('/student/:studentId/performance', protect, authorize('admin','staff','teacher','student','parent'), getStudentPerformanceReport);
router.get('/student/:studentId/attendance', protect, authorize('admin','staff','teacher','student','parent'), getStudentAttendanceReport);

// Library usage report (admin/staff)
router.get('/library', protect, authorize('admin','staff'), getLibraryUsageReport);

// Dashboard summary (admin/staff)
router.get('/dashboard', protect, authorize('admin','staff'), getDashboardSummary);

export default router;