import User from '../schemas/user.schema';
import FpMail from '../schemas/fpMail.schema';
import Bcrypt from 'bcrypt';
import FpMailSender from '../utils/fpMailSender.util';
import { AppError } from '../middlewares/errorHandlers.middleware';
import { logger } from '../configs/logger.config';

export const requestPasswordReset = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User doesn't exist!", 401);
  }
  const sendMail = await FpMailSender.sendEmail(email);
  logger.info('New Password reset submitted');
  if (!sendMail) {
    throw new AppError('Failed to send OTP!', 400);
  }
};

export const verifyOtp = async (email: string, code: number) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('User not registered', 404);
  }
  const fpMail = await FpMail.findOne({ email });
  if (!fpMail || fpMail.code !== code) {
    throw new AppError('Invalid OTP', 401);
  }
  fpMail.verified = true;
  await fpMail.save();
  return User.findOne({ email });
};

export const updatePassword = async (email: string, newPassword: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('User does not exist!', 401);
  }
  const fpMail = await FpMail.findOne({ email });
  if (!fpMail || !fpMail.verified) {
    throw new AppError('OTP code not verified!', 400);
  }
  if (await Bcrypt.compare(newPassword, user.password)) {
    throw new AppError('New password cannot be same as previous password', 400);
  }
  const newPasswordHash = await Bcrypt.hash(newPassword, 10);
  user.password = newPasswordHash;
  await user.save();
  return user;
};
