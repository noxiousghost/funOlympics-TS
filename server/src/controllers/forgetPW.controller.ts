import { Request, Response } from 'express';
import * as PasswordService from '../services/forgetPW.service';
import { catchAsync } from '../middlewares/errorHandlers.middleware';

export const sendResetEmail = catchAsync(
  async (req: Request, res: Response) => {
    await PasswordService.requestPasswordReset(req.body.email);
    res.status(201).json({ message: 'Change password OTP sent.' });
  },
);

export const verifyOtpCode = catchAsync(async (req: Request, res: Response) => {
  await PasswordService.verifyOtp(req.body.email, req.body.code);
  res.status(200).json({ message: 'OTP verified successfully!' });
});

export const changePassword = catchAsync(
  async (req: Request, res: Response) => {
    await PasswordService.updatePassword(req.body.email, req.body.password);
    res.status(200).json({ message: 'Password changed successfully' });
  },
);
