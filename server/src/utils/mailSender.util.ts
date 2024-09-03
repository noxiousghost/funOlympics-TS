/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import MailService from './mail.util';
import { envVars } from '../configs/envVars.config';

const SENDER_EMAIL = envVars.EMAIL as string;
const EMAIL_PASSWORD = envVars.PASSWORD as string;

class MailSender {
  async sendEmail(email: string): Promise<boolean | string> {
    const code = 100000 + Math.floor(Math.random() * 900000);
    const savedCode = await MailService.saveToken(email, code);
    if (!savedCode) return false;

    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: SENDER_EMAIL,
          pass: EMAIL_PASSWORD,
        },
      });

      const verified = await transporter.verify();
      if (!verified) return false;

      const info = await transporter.sendMail({
        from: SENDER_EMAIL,
        to: email,
        subject: 'Verify your account',
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2;margin-left: -100px;">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #7d5e00;text-decoration:none;font-weight:600">Fun Olympics</a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Welcome to Pyaris Fun Olympic. Use the following OTP to complete your Registration procedures. OTP is valid for 5 minutes</p>
          <h2 style="background: #ffc107;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${code}</h2>
          <p style="font-size:0.9em;">Regards,<br />Fun Olympic</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Pyaris Fun Olympic</p>
            <p>52 Avenue Parmentier</p>
            <p>Paris</p>
          </div>
        </div>
      </div>`,
      });

      return info ? true : false;
    } catch (error: any) {
      return error.message;
    }
  }
}

export default new MailSender();
