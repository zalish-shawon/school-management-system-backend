import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ApiError from '../utils/ApiError';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface IAuthRequest extends Request {
  user?: any;
}

export const protect = (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) throw new ApiError(401, 'Not authorized');
    const token = authHeader.split(' ')[1];
    const payload: any = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    next(new ApiError(401, 'Not authorized'));
  }
};

export const authorize = (...roles: string[]) => (req: IAuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return next(new ApiError(401, 'Not authorized'));
  if (!roles.includes(req.user.role)) return next(new ApiError(403, 'Forbidden'));
  next();
};