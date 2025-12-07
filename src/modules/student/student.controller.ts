import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import ApiError from "../../utils/ApiError";
import Student from "./student.model";

// Create student
export const createStudent = catchAsync(async (req: Request, res: Response) => {
  const student = await Student.create(req.body);
  res.status(201).json({ success: true, data: student });
});

// Get all students
export const getStudents = catchAsync(async (req: Request, res: Response) => {
  const students = await Student.find({ isDeleted: false })
    .populate("classId sectionId");
  res.json({ success: true, data: students });
});

// Get one student
export const getStudent = catchAsync(async (req: Request, res: Response) => {
  const student = await Student.findById(req.params.id).populate(
    "classId sectionId"
  );
  if (!student || student.isDeleted)
    throw new ApiError(404, "Student not found");

  res.json({ success: true, data: student });
});

// Update student
export const updateStudent = catchAsync(async (req: Request, res: Response) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updated) throw new ApiError(404, "Student not found");
  res.json({ success: true, data: updated });
});

// Delete student (soft)
export const deleteStudent = catchAsync(async (req: Request, res: Response) => {
  const deleted = await Student.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );

  if (!deleted) throw new ApiError(404, "Student not found");
  res.json({ success: true, message: "Student deleted" });
});

// Promote student
export const promoteStudent = catchAsync(async (req: Request, res: Response) => {
  const { newClassId, newSectionId } = req.body;

  const student = await Student.findByIdAndUpdate(
    req.params.id,
    { classId: newClassId, sectionId: newSectionId },
    { new: true }
  );

  if (!student) throw new ApiError(404, "Student not found");
  res.json({ success: true, data: student });
});