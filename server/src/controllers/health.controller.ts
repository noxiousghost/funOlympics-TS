import { NextFunction, Request, Response } from 'express';
import * as HealthService from '../services/health.service';
import { logger } from '../configs/logger.config';
import { AppError } from '../middlewares/errorHandlers.middleware';
export const checkHealth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const healthStatus = await HealthService.getHealthStatus();
    res.status(200).json(healthStatus);
  } catch (error) {
    logger.error(error);
    next(new AppError('Health check failed', 500));
  }
};
