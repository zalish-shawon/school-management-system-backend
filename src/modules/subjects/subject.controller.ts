import catchAsync from "../../utils/catchAsync";
import ApiError from "../../utils/ApiError";
import { Subject } from "./subject.model";
import { Request, Response } from "express";

// Create Subject
export const createSubject = catchAsync(async (req: Request, res: Response) => {
  const subject = await Subject.create(req.body);
  res.status(201).json({ success: true, data: subject });
});

// Get All Subjects
export const getSubjects = catchAsync(async (req: Request, res: Response) => {
  const subjects = await Subject.find({ isDeleted: false }).populate(
    "assignedTeacher"
  );
  res.status(200).json({ success: true, data: subjects });
});

// Get Subject by ID
export const getSubject = catchAsync(async (req: Request, res: Response) => {
  const subject = await Subject.findById(req.params.id).populate(
    "assignedTeacher"
  );
  if (!subject || subject.isDeleted)
    throw new ApiError(404, "Subject not found");

  res.status(200).json({ success: true, data: subject });
});

// Update Subject
export const updateSubject = catchAsync(async (req: Request, res: Response) => {
  const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) throw new ApiError(404, "Subject not found");
  res.status(200).json({ success: true, data: updated });
});

// Assign Teacher to Subject
export const assignTeacher = catchAsync(async (req: Request, res: Response) => {
  const { teacherId } = req.body;
  const updated = await Subject.findByIdAndUpdate(
    req.params.id,
    { assignedTeacher: teacherId },
    { new: true }
  );

  if (!updated) throw new ApiError(404, "Subject not found");
  res.status(200).json({ success: true, data: updated });
});

// Soft Delete Subject
export const deleteSubject = catchAsync(async (req: Request, res: Response) => {
  const deleted = await Subject.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );

  if (!deleted) throw new ApiError(404, "Subject not found");
  res.status(200).json({ success: true, message: "Subject deleted" });
});