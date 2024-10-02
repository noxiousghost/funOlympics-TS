/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandlers.middleware';
export const unknownEndpoint = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
};
