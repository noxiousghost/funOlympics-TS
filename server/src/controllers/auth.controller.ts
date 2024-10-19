import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

// Create user
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await authService.createUser(req.body);
    res.status(201).json({ message: 'user created successfully' });
  } catch (error) {
    next(error);
  }
};

// Verify user
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await authService.verifyUser(req.body.email, req.body.code);
    res.status(200).json({ message: 'user verified successfully' });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const { token } = await authService.authenticateUser(email, password);

    res.status(200).json({
      token,
      message: 'Logged in successfully',
    });
  } catch (error) {
    next(error);
  }
};
