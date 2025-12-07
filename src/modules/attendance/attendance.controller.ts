import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../../utils/catchAsync';
import ApiError from '../../utils/ApiError';
import StudentAttendance from './studentAttendance.model';
import TeacherAttendance from './teacherAttendance.model';

// Bulk submit student attendance (upsert per student + date)
export const submitStudentAttendance = catchAsync(async (req: Request, res: Response) => {
  const { date, records } = req.body; // records: [{ student, classId, sectionId, status, remark }]
  if (!date || !Array.isArray(records)) throw new ApiError(400, 'Invalid payload');

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const ops = records.map(r => ({
      updateOne: {
        filter: { student: r.student, date: new Date(date) },
        update: {
          $set: {
            student: r.student,
            classId: r.classId,
            sectionId: r.sectionId,
            date: new Date(date),
            status: r.status,
            remark: r.remark || '',
          }
        },
        upsert: true
      }
    }));

    if (ops.length) await StudentAttendance.bulkWrite(ops, { session });
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, message: 'Attendance submitted' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

// Get attendance for a class/section on a date
export const getClassAttendance = catchAsync(async (req: Request, res: Response) => {
  const { classId, sectionId, date } = req.params;
  const d = new Date(date);
  const records = await StudentAttendance.find({ classId, sectionId, date: d }).populate('student', 'name admissionId');
  res.json({ success: true, data: records });
});

// Get student attendance history
export const getStudentAttendanceHistory = catchAsync(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { from, to } = req.query;
  const q: any = { student: studentId };
  if (from || to) q.date = {};
  if (from) q.date.$gte = new Date(String(from));
  if (to) q.date.$lte = new Date(String(to));

  const records = await StudentAttendance.find(q).sort({ date: -1 });
  res.json({ success: true, data: records });
});

// Student attendance percentage
export const getStudentAttendancePercentage = catchAsync(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { from, to } = req.query;
  if (!from || !to) throw new ApiError(400, 'Provide from and to dates');

  const fromD = new Date(String(from));
  const toD = new Date(String(to));

  const total = await StudentAttendance.countDocuments({ student: studentId, date: { $gte: fromD, $lte: toD } });
  const present = await StudentAttendance.countDocuments({ student: studentId, date: { $gte: fromD, $lte: toD }, status: 'present' });

  const percentage = total === 0 ? 0 : Math.round((present / total) * 10000) / 100;
  res.json({ success: true, data: { total, present, percentage } });
});

// Teacher check-in
export const teacherCheckIn = catchAsync(async (req: Request, res: Response) => {
  const teacherId = req.user.id;
  const today = new Date();
  today.setHours(0,0,0,0);

  const record = await TeacherAttendance.findOneAndUpdate(
    { teacher: teacherId, date: today },
    { $setOnInsert: { teacher: teacherId, date: today }, $set: { status: 'present' }, $setOnInsert: { checkIn: new Date() } },
    { upsert: true, new: true }
  );

  if (!record.checkIn) { record.checkIn = new Date(); await record.save(); }

  res.json({ success: true, data: record });
});

// Teacher check-out
export const teacherCheckOut = catchAsync(async (req: Request, res: Response) => {
  const teacherId = req.user.id;
  const today = new Date();
  today.setHours(0,0,0,0);

  const record = await TeacherAttendance.findOne({ teacher: teacherId, date: today });
  if (!record) throw new ApiError(400, 'No check-in record for today');

  record.checkOut = new Date();
  await record.save();

  res.json({ success: true, data: record });
});

// Teacher monthly summary
export const getTeacherMonthlySummary = catchAsync(async (req: Request, res: Response) => {
  const { teacherId } = req.params;
  const { year, month } = req.query;
  if (!year || !month) throw new ApiError(400, 'Provide year and month');

  const y = Number(year);
  const m = Number(month) - 1;
  const from = new Date(y, m, 1);
  const to = new Date(y, m + 1, 0, 23, 59, 59, 999);

  const records = await TeacherAttendance.find({ teacher: teacherId, date: { $gte: from, $lte: to } }).sort({ date: 1 });
  res.json({ success: true, data: records });
});