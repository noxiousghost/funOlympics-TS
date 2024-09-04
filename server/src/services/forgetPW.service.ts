import User from '../schemas/user.schema';
import FpMail from '../schemas/fpMail.schema';
import Bcrypt from 'bcrypt';
import FpMailSender from '../utils/fpMailSender.util';

export const requestPasswordReset = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User doesn't exist!");
  }
  const sendMail = await FpMailSender.sendEmail(email);
  if (!sendMail) {
    throw new Error('Failed to send OTP!');
  }
};

export const verifyOtp = async (email: string, code: number) => {
  const fpMail = await FpMail.findOne({ email });
  if (!fpMail || fpMail.code !== code) {
    throw new Error('Invalid OTP');
  }
  fpMail.verified = true;
  await fpMail.save();
  return User.findOne({ email });
};

export const updatePassword = async (email: string, newPassword: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User does not exist!');
  }
  const fpMail = await FpMail.findOne({ email });
  if (!fpMail || !fpMail.verified) {
    throw new Error('OTP code not verified!');
  }
  const newPasswordHash = await Bcrypt.hash(newPassword, 10);
  user.passwordHash = newPasswordHash;
  await user.save();
  return user;
};
