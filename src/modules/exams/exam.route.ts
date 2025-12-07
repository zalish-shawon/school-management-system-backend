import express from 'express';
import { protect, authorize } from '../../middlewares/auth';
import {
  createExam,
  submitMarks,
  getExamMarks,
  getStudentResult
} from './exam.controller';

const router = express.Router();

// Exam management (admin/staff)
router.post('/create', protect, authorize('admin', 'staff'), createExam);
router.post('/marks/submit', protect, authorize('admin', 'staff'), submitMarks);
router.get('/marks/:examId', protect, authorize('admin', 'staff', 'teacher'), getExamMarks);

// Student result card (student/parent)
router.get('/student/:studentId/result', protect, authorize('admin', 'staff', 'teacher', 'student', 'parent'), getStudentResult);

export default router;