import { Request, Response, NextFunction } from 'express';

export const setFileType = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const url = req.baseUrl || req.originalUrl;
  const fileType = url.replace('/api/', '');
  req.fileType = fileType;
  next();
};
