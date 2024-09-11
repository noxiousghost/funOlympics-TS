import { Request, Response, NextFunction } from 'express';
import { MongoServerError } from 'mongodb';
import { logger } from '../configs/logger.config';

// Custom Error Class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error Handler Middleware
export const errorHandler = (err: Error, req: Request, res: Response) => {
  let statusCode = 500;
  let message = 'Something went wrong';

  // Log error for debugging
  logger.error(err.message);

  // Handle known operational errors (custom AppError)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle specific Mongoose-related errors
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
    case 'MongoError':
      if ((err as MongoServerError).code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
      }
      break;
  }

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    message,
  });
};

// Async Error Wrapper
export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
