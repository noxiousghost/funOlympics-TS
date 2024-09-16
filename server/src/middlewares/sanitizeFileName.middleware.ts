import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Middleware to sanitize file names
export const sanitizeFileName = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.file) {
    const sanitizedName = req.file.filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const oldPath = req.file.path;
    const newPath = path.join(path.dirname(oldPath), sanitizedName);
    fs.renameSync(oldPath, newPath);
    req.file.filename = sanitizedName;
    req.file.path = newPath;
  }
  next();
};
