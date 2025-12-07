import express from 'express';
import { protect, authorize } from '../../middlewares/auth';
import {
  submitStudentAttendance,
  getClassAttendance,
  getStudentAttendanceHistory,
  getStudentAttendancePercentage,
  teacherCheckIn,
  teacherCheckOut,
  getTeacherMonthlySummary
} from './attendance.controller';

const router = express.Router();

// Student attendance routes (admin/staff)
router.post('/student/submit', protect, authorize('admin', 'staff'), submitStudentAttendance);
router.get('/student/class/:classId/section/:sectionId/date/:date', protect, authorize('admin', 'staff', 'teacher'), getClassAttendance);
router.get('/student/:studentId/history', protect, authorize('admin', 'staff', 'teacher', 'student', 'parent'), getStudentAttendanceHistory);
router.get('/student/:studentId/percentage', protect, authorize('admin', 'staff', 'teacher', 'student', 'parent'), getStudentAttendancePercentage);

// Teacher attendance routes (teacher)
router.post('/teacher/checkin', protect, authorize('teacher'), teacherCheckIn);
router.post('/teacher/checkout', protect, authorize('teacher'), teacherCheckOut);
router.get('/teacher/:teacherId/summary', protect, authorize('admin', 'staff', 'teacher'), getTeacherMonthlySummary);

export default router;