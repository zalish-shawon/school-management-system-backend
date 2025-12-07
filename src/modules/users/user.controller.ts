import { Request, Response } from "express";
import User from "./user.model";
import catchAsync from "../../utils/catchAsync";
import ApiError from "../../utils/ApiError";

// Get all users
export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find().select("-password");
  res.json({ success: true, data: users });
});

// Get single user
export const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) throw new ApiError(404, "User not found");
  res.json({ success: true, data: user });
});

// Update user
export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { name, phone, role } = req.body;
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { name, phone, role },
    { new: true }
  ).select("-password");

  if (!updated) throw new ApiError(404, "User not found");
  res.json({ success: true, data: updated });
});

// Soft delete user
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );

  if (!user) throw new ApiError(404, "User not found");
  res.json({ success: true, message: "User deleted" });
});