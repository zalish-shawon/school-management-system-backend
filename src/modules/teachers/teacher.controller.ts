import catchAsync from "../../utils/catchAsync";
import ApiError from "../../utils/ApiError";
import { Teacher } from "./teacher.model";
import { Request, Response } from "express";

export const createTeacher = catchAsync(async (req: Request, res: Response) => {
  const teacher = await Teacher.create(req.body);
  res.status(201).json({ success: true, data: teacher });
});

export const getTeachers = catchAsync(async (req: Request, res: Response) => {
  const teachers = await Teacher.find().populate("assignedClasses");
  res.status(200).json({ success: true, data: teachers });
});

export const getTeacher = catchAsync(async (req: Request, res: Response) => {
  const teacher = await Teacher.findById(req.params.id).populate("assignedClasses");
  if (!teacher) throw new ApiError(404, "Teacher not found");
  res.status(200).json({ success: true, data: teacher });
});

export const updateTeacher = catchAsync(async (req: Request, res: Response) => {
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!teacher) throw new ApiError(404, "Teacher not found");
  res.status(200).json({ success: true, data: teacher });
});

export const softDeleteTeacher = catchAsync(async (req: Request, res: Response) => {
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, {
    status: "inactive",
  });
  if (!teacher) throw new ApiError(404, "Teacher not found");
  res.status(200).json({ success: true, message: "Teacher deactivated" });
});

export const assignClass = catchAsync(async (req: Request, res: Response) => {
  const { classId } = req.body;
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) throw new ApiError(404, "Teacher not found");

  if (!teacher.assignedClasses.includes(classId)) {
    teacher.assignedClasses.push(classId);
  }
  await teacher.save();

  res.status(200).json({ success: true, data: teacher });
});

export const assignSubject = catchAsync(async (req: Request, res: Response) => {
  const { subject } = req.body;
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) throw new ApiError(404, "Teacher not found");

  if (!teacher.assignedSubjects.includes(subject)) {
    teacher.assignedSubjects.push(subject);
  }

  await teacher.save();

  res.status(200).json({ success: true, data: teacher });
});