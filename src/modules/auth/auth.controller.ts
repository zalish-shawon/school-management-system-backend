import { Request, Response } from "express";
import dotenv from "dotenv";
import catchAsync from "../../utils/catchAsync";
import User from "../users/user.model";
import RefreshToken from "./auth.model";
import ApiError from "../../utils/ApiError";
import jwt, { SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export function signAccessToken(userId: string, role: string) {
  const jwtSecret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN as StringValue;

  return jwt.sign(
    { sub: userId, role },
    jwtSecret as string,
    { expiresIn }
  );
}

export function signRefreshToken(userId: string) {
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue;

  return jwt.sign(
    { sub: userId },
    refreshSecret as string,
    { expiresIn }
  );
}

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(400, "Email already in use");
  const user = await User.create({ name, email, password, role });
  const accessToken = signAccessToken(user._id.toString(), user.role);
  const refreshToken = signRefreshToken(user._id.toString());

  // Save refresh token
  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
  });

  res
    .status(201)
    .json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid credentials");
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const accessToken = signAccessToken(user._id.toString(), user.role);
  const refreshToken = signRefreshToken(user._id.toString());
  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
  });

  console.log("Logged in successfully");
  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(400, "No refresh token provided");

  const stored = await RefreshToken.findOne({ token: refreshToken });
  if (!stored) throw new ApiError(401, "Invalid refresh token");

  try {
    const payload: any = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) throw new ApiError(401, "User not found");

    const accessToken = signAccessToken(user._id.toString(), user.role);
    res.json({ accessToken });
  } catch (err) {
    throw new ApiError(401, "Invalid refresh token");
  }
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }
  console.log("Logged out successfully");
  res.json({ ok: true });
});
