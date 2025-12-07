import { Request, Response, NextFunction } from 'express';

export default function catchAsync(fn: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}