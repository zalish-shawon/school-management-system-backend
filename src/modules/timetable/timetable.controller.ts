import catchAsync from "../../utils/catchAsync";
import ApiError from "../../utils/ApiError";
import { Timetable } from "./timetable.model";
import { Request, Response } from "express";

// Prevent teacher double booking
async function checkTeacherConflict(day: string, period: number, teacherId: string) {
  const conflict = await Timetable.findOne({
    day,
    period,
    teacherId,
    isDeleted: false,
  } as any);
  return !!conflict;
}

// Prevent class conflict
async function checkClassConflict(day: string, period: number, classId: string, sectionId: string) {
  const conflict = await Timetable.findOne({
    day,
    period,
    classId,
    sectionId,
    isDeleted: false,
  } as any);
  return !!conflict;
}

// Create a timetable entry
export const createTimetable = catchAsync(async (req: Request, res: Response) => {
  const { day, period, teacherId, classId, sectionId } = req.body;

  if (await checkTeacherConflict(day, period, teacherId)) {
    throw new ApiError(400, "Teacher already has a class in this period.");
  }

  if (await checkClassConflict(day, period, classId, sectionId)) {
    throw new ApiError(400, "Class/Section already has a scheduled class.");
  }

  const entry = await Timetable.create(req.body);
  res.status(201).json({ success: true, data: entry });
});

// Get Routine by Class & Section
export const getClassRoutine = catchAsync(async (req: Request, res: Response) => {
  const { classId, sectionId } = req.params;

  const filter: any = { classId, sectionId, isDeleted: false };

  const routine = await Timetable.find(filter)
    .populate("teacherId")
    .populate("subjectId")
    .sort({ day: 1, period: 1 });

  res.status(200).json({ success: true, data: routine });
});

// Get Routine for a specific Teacher
export const getTeacherRoutine = catchAsync(async (req: Request, res: Response) => {
  const { teacherId } = req.params;

  const filter: any = { teacherId, isDeleted: false };

  const routine = await Timetable.find(filter)
    .populate("classId")
    .populate("sectionId")
    .populate("subjectId")
    .sort({ day: 1, period: 1 });

  res.status(200).json({ success: true, data: routine });
});

// Update timetable entry
export const updateTimetable = catchAsync(async (req: Request, res: Response) => {
  const updated = await Timetable.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updated) throw new ApiError(404, "Timetable entry not found");
  res.status(200).json({ success: true, data: updated });
});

// Delete timetable entry
export const deleteTimetable = catchAsync(async (req: Request, res: Response) => {
  const deleted = await Timetable.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );

  if (!deleted) throw new ApiError(404, "Timetable entry not found");

  res.status(200).json({ success: true, message: "Timetable entry deleted" });
});