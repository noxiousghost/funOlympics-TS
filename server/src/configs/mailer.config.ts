import nodemailer from 'nodemailer';
import { envVars } from './envVars.config';
import { logger } from './logger.config';

const SENDER_EMAIL = envVars.EMAIL as string;
const EMAIL_PASSWORD = envVars.PASSWORD as string;

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: SENDER_EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

export const verifyTransporter = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    logger.error('Failed to verify transporter:', error);
    return false;
  }
};
