import News from '../schemas/news.schema';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandlers.middleware';

export const newsExists = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { title } = req.body;
  const exists = await News.findOne({ title: title });
  if (exists) {
    const path = req.file?.path;
    if (path) {
      fs.rmSync(path);
    }
    return next(new AppError(`${req.body.title} already exists!`, 409));
  }

  next();
};
