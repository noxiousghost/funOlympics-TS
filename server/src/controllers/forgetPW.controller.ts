/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import * as PasswordService from '../services/forgetPW.service';

export const sendResetEmail = async (req: Request, res: Response) => {
  try {
    await PasswordService.requestPasswordReset(req.body.email);
    res.status(201).json({ message: 'Change password OTP sent.' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const verifyOtpCode = async (req: Request, res: Response) => {
  try {
    const user = await PasswordService.verifyOtp(req.body.email, req.body.code);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const user = await PasswordService.updatePassword(
      req.body.email,
      req.body.password,
    );
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
