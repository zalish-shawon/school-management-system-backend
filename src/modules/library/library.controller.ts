import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import ApiError from '../../utils/ApiError';
import Book from './book.model';
import LibraryMember from './member.model';
import BookIssue from './issue.model';

// Add new book
export const addBook = catchAsync(async (req: Request, res: Response) => {
  const { title, author, isbn, category, copiesAvailable } = req.body;
  if (!title || !author || !isbn || !category) throw new ApiError(400, 'Missing required fields');
  const book = await Book.create({ title, author, isbn, category, copiesAvailable });
  res.status(201).json({ success: true, data: book });
});

// Register new member
export const addMember = catchAsync(async (req: Request, res: Response) => {
  const { studentId, teacherId, name, memberType } = req.body;
  if (!name || !memberType) throw new ApiError(400, 'Missing required fields');
  const member = await LibraryMember.create({ studentId, teacherId, name, memberType });
  res.status(201).json({ success: true, data: member });
});

// Issue book
export const issueBook = catchAsync(async (req: Request, res: Response) => {
  const { bookId, memberId, dueDate } = req.body;
  if (!bookId || !memberId || !dueDate) throw new ApiError(400, 'Missing required fields');

  const book = await Book.findById(bookId);
  if (!book || book.copiesAvailable < 1) throw new ApiError(400, 'Book not available');

  book.copiesAvailable -= 1;
  await book.save();

  const issue = await BookIssue.create({ bookId, memberId, dueDate });
  res.status(201).json({ success: true, data: issue });
});

// Return book & calculate fine
export const returnBook = catchAsync(async (req: Request, res: Response) => {
  const { issueId } = req.body;
  if (!issueId) throw new ApiError(400, 'Missing issueId');

  const issue = await BookIssue.findById(issueId);
  if (!issue) throw new ApiError(404, 'Issue record not found');

  if (!issue.returnDate) {
    const now = new Date();
    issue.returnDate = now;
    const lateDays = Math.max(0, Math.ceil((now.getTime() - issue.dueDate.getTime()) / (1000*60*60*24)));
    issue.fine = lateDays * 10; // 10 currency units per late day
    await issue.save();

    const book = await Book.findById(issue.bookId);
    if (book) {
      book.copiesAvailable += 1;
      await book.save();
    }
  }

  res.json({ success: true, data: issue });
});

// Get all issued books
export const getIssuedBooks = catchAsync(async (req: Request, res: Response) => {
  const issues = await BookIssue.find().populate('bookId').populate('memberId');
  res.json({ success: true, data: issues });
});