/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { MongoServerError } from 'mongodb';
import { envVars } from '../configs/envVars.config';
import { logger } from '../configs/logger.config';
import multer from 'multer';
import { AppError } from 'configs/AppError.config';

// middleware to handle errors
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = 'Something went wrong';

  logger.error(`${err.stack}`);

  // Handle known operational errors (custom AppError)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle specific errors
  switch (err.name) {
    case 'CastError':
      statusCode = 400;
      message = 'Malformed ID';
      break;
    case 'ValidationError':
      statusCode = 400;
      message = err.message;
      break;
    case 'JsonWebTokenError':
      statusCode = 401;
      message = 'Invalid token';
      break;
    case 'TokenExpiredError':
      statusCode = 401;
      message = 'Token expired';
      break;
    case 'MongoServerError':
      if ((err as MongoServerError).code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
      }
      break;
    case 'MulterError':
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          statusCode = 413;
          message = 'File size limit exceeded';
        } else {
          statusCode = 400;
          message = `Multer error: ${err.message}`;
        }
      }
      break;
  }

  // In development, send stack trace for better debugging
  const isDevelopment = envVars.ENV === 'development';

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(isDevelopment && { stack: err.stack }),
  });
};

// Async Error Wrapper for cleaner controller code
export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next); // Forward error to errorHandler
  };
};

export { AppError };
