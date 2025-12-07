import catchAsync from "../../utils/catchAsync";
import ApiError from "../../utils/ApiError";
import { ClassModel } from "./class.model";
import { Section } from "./section.model";
import studentModel from "../student/student.model";
import { Request, Response } from "express";

export const createClass = catchAsync(async (req: Request, res: Response) => {
  const newClass = await ClassModel.create(req.body);
  res.status(201).json({ success: true, data: newClass });
});

export const getClasses = catchAsync(async (req: Request, res: Response) => {
  const classes = await ClassModel.find().populate("sections classTeacher");
  res.status(200).json({ success: true, data: classes });
});

export const getClass = catchAsync(async (req: Request, res: Response) => {
  const singleClass = await ClassModel.findById(req.params.id).populate(
    "sections classTeacher"
  );
  if (!singleClass) throw new ApiError(404, "Class not found");

  res.status(200).json({ success: true, data: singleClass });
});

export const updateClass = catchAsync(async (req: Request, res: Response) => {
  const updated = await ClassModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) throw new ApiError(404, "Class not found");
  res.status(200).json({ success: true, data: updated });
});

export const assignClassTeacher = catchAsync(async (req: Request, res: Response) => {
  const { teacherId } = req.body;
  const updated = await ClassModel.findByIdAndUpdate(
    req.params.id,
    { classTeacher: teacherId },
    { new: true }
  );

  if (!updated) throw new ApiError(404, "Class not found");
  res.status(200).json({ success: true, data: updated });
});

export const refreshStudentCount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const count = await studentModel.countDocuments({ class: id });

  const updated = await ClassModel.findByIdAndUpdate(
    id,
    { studentCount: count },
    { new: true }
  );

  res.status(200).json({ success: true, data: updated });
});