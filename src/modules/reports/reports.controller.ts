import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import StudentAttendance from "../attendance/studentAttendance.model";
import Marks from "../exams/marks.model";
import BookIssue from "../library/issue.model";
import Book from "../library/book.model";

// Student performance report (GPA, grades)
export const getStudentPerformanceReport = catchAsync(
  async (req: Request, res: Response) => {
    const { studentId } = req.params;
    const marksRecords = await Marks.find({ studentId })
      .populate<{ examId: { name: string; totalMarks: number } }>(
        "examId",
        "name totalMarks"
      )
      .populate<{ subjectId: { name: string } }>("subjectId", "name");

    const results = marksRecords.map((m) => ({
      exam: m.examId.name,
      subject: m.subjectId.name,
      obtainedMarks: m.obtainedMarks,
      totalMarks: m.examId.totalMarks,
      grade:
        m.obtainedMarks >= m.examId.totalMarks * 0.9
          ? "A"
          : m.obtainedMarks >= m.examId.totalMarks * 0.8
          ? "B"
          : m.obtainedMarks >= m.examId.totalMarks * 0.7
          ? "C"
          : m.obtainedMarks >= m.examId.totalMarks * 0.6
          ? "D"
          : "F",
    }));

    res.json({ success: true, data: results });
  }
);

// Attendance report (percentage) for a student
export const getStudentAttendanceReport = catchAsync(
  async (req: Request, res: Response) => {
    const { studentId } = req.params;
    const { from, to } = req.query;

    const query: any = { student: studentId };
    if (from || to) query.date = {};
    if (from) query.date.$gte = new Date(String(from));
    if (to) query.date.$lte = new Date(String(to));

    const total = await StudentAttendance.countDocuments(query);
    const present = await StudentAttendance.countDocuments({
      ...query,
      status: "present",
    });
    const percentage =
      total === 0 ? 0 : Math.round((present / total) * 10000) / 100;

    res.json({ success: true, data: { total, present, percentage } });
  }
);

// Library usage report
export const getLibraryUsageReport = catchAsync(
  async (req: Request, res: Response) => {
    const issues = await BookIssue.find()
      .populate<{ bookId: { title: string } }>("bookId", "title")
      .populate<{ memberId: { name: string } }>("memberId", "name");

    const usage = issues.map((i) => ({
      book: i.bookId.title,
      member: i.memberId.name,
      issueDate: i.issueDate,
      returnDate: i.returnDate,
      fine: i.fine,
    }));

    const totalBooks = await Book.countDocuments();
    res.json({
      success: true,
      totalBooks,
      totalIssues: issues.length,
      data: usage,
    });
  }
);

// Dashboard summary (attendance, exams, library)
export const getDashboardSummary = catchAsync(
  async (req: Request, res: Response) => {
    const totalStudents = await StudentAttendance.distinct("student").then(
      (arr) => arr.length
    );
    const totalExams = await Marks.distinct("examId").then((arr) => arr.length);
    const totalIssuedBooks = await BookIssue.countDocuments();

    res.json({
      success: true,
      data: { totalStudents, totalExams, totalIssuedBooks },
    });
  }
);
