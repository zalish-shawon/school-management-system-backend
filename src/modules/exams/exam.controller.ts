import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../../utils/catchAsync';
import ApiError from '../../utils/ApiError';
import Exam from './exam.model';
import Marks from './marks.model';

// Create a new exam
export const createExam = catchAsync(async (req: Request, res: Response) => {
  const { name, classId, sectionId, date, totalMarks } = req.body;
  if (!name || !classId || !date || !totalMarks) throw new ApiError(400, 'Missing required fields');

  const exam = await Exam.create({ name, classId, sectionId, date, totalMarks });
  res.status(201).json({ success: true, data: exam });
});

// Enter marks for students (bulk)
export const submitMarks = catchAsync(async (req: Request, res: Response) => {
  const { examId, records } = req.body; // records: [{ studentId, subjectId, obtainedMarks }]
  if (!examId || !Array.isArray(records)) throw new ApiError(400, 'Invalid payload');

  const examObjectId = new mongoose.Types.ObjectId(examId);

  const bulkOps: any[] = records.map(r => ({
    updateOne: {
      filter: { examId: examObjectId, studentId: new mongoose.Types.ObjectId(r.studentId), subjectId: new mongoose.Types.ObjectId(r.subjectId) },
      update: { $set: { obtainedMarks: r.obtainedMarks } },
      upsert: true
    }
  }));

  if (bulkOps.length) await Marks.bulkWrite(bulkOps as any);
  res.status(200).json({ success: true, message: 'Marks submitted successfully' });
});

// Get marks for an exam
export const getExamMarks = catchAsync(async (req: Request, res: Response) => {
  const { examId } = req.params;
  if (!examId) throw new ApiError(400, 'Missing examId');

  const examObjectId = new mongoose.Types.ObjectId(examId);
  const marks = await Marks.find({ examId: examObjectId })
  .populate('studentId', 'name admissionId')
  .populate('subjectId', 'name');

  res.json({ success: true, data: marks });
});

// Calculate grade for marks (WES style or school-specific)
export const calculateGrade = (marks: number, totalMarks: number) => {
  const percentage = (marks / totalMarks) * 100;
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

// Generate result card for a student
export const getStudentResult = catchAsync(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const studentObjectId = new mongoose.Types.ObjectId(studentId);

  // cast to any[] because populated types may differ from schema typings
  const marksRecords = await Marks.find({ studentId: studentObjectId } as any).populate('examId', 'name totalMarks').populate('subjectId', 'name') as any[];

  const results = marksRecords.map(m => ({
    exam: m.examId?.name,
    subject: m.subjectId?.name,
    obtainedMarks: m.obtainedMarks,
    totalMarks: m.examId?.totalMarks,
    grade: calculateGrade(m.obtainedMarks, m.examId?.totalMarks || 0),
  }));

  res.json({ success: true, data: results });
});