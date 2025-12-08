import express from 'express';
import { protect, authorize } from '../../middlewares/auth';
import {
  addBook,
  addMember,
  issueBook,
  returnBook,
  getIssuedBooks
} from './library.controller';

const router = express.Router();

// Book routes (admin/staff)
router.post('/book/add', protect, authorize('admin', 'staff'), addBook);

// Member routes (admin/staff)
router.post('/member/add', protect, authorize('admin', 'staff'), addMember);

// Issue/return routes (admin/staff)
router.post('/book/issue', protect, authorize('admin', 'staff'), issueBook);
router.post('/book/return', protect, authorize('admin', 'staff'), returnBook);
router.get('/issued', protect, authorize('admin', 'staff'), getIssuedBooks);

export default router;