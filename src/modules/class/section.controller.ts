import catchAsync from "../../utils/catchAsync";
import ApiError from "../../utils/ApiError";
import { Section } from "./section.model";
import { ClassModel } from "./class.model";
import { Request, Response } from "express";

export const createSection = catchAsync(async (req: Request, res: Response) => {
  const sections = await Section.create(req.body);
  const section = Array.isArray(sections) ? sections[0] : sections;

  // push section to class
  await ClassModel.findByIdAndUpdate(section.classId, {
    $push: { sections: section._id },
  });

  res.status(201).json({ success: true, data: section });
});

export const updateSection = catchAsync(async (req: Request, res: Response) => {
  const updated = await Section.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updated) throw new ApiError(404, "Section not found");
  res.status(200).json({ success: true, data: updated });
});

export const getSections = catchAsync(async (req: Request, res: Response) => {
  const sections = await Section.find().populate("classId classTeacher");
  res.status(200).json({ success: true, data: sections });
});