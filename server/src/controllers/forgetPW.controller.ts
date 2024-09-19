import { NextFunction, Request, Response } from 'express';
import * as PasswordService from '../services/forgetPW.service';

export const sendResetEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await PasswordService.requestPasswordReset(req.body.email);
    res.status(201).json({ message: 'Change password OTP sent.' });
  } catch (error) {
    next(error);
  }
};

export const verifyOtpCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await PasswordService.verifyOtp(req.body.email, req.body.code);
    res.status(200).json({ message: 'OTP verified successfully!' });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await PasswordService.updatePassword(req.body.email, req.body.password);
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};
