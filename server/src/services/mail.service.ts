import { transporter, verifyTransporter } from '../configs/mailer.config';
import OtpService, { OtpType } from './otp.service';
import { envVars } from '../configs/envVars.config';
import { AppError } from 'configs/AppError.config';

const SENDER_EMAIL = envVars.EMAIL as string;

interface MailTemplate {
  subject: string;
  body: (code: number) => string;
}

const templates: Record<OtpType, MailTemplate> = {
  [OtpType.SIGNUP]: {
    subject: 'Verify your account',
    body: (code: number) => `
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2;margin-left: -100px;">
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
      </div>
    `,
  },
  [OtpType.FORGOT_PASSWORD]: {
    subject: 'Reset your password',
    body: (code: number) => `
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2;margin-left: -100px;">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #7d5e00;text-decoration:none;font-weight:600">Fun Olympics</a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>We received a request to recover your account. Please use the following OTP to reset your password. This OTP is valid for 5 minutes:</p>
          <h2 style="background: #ffc107;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${code}</h2>
          <p style="font-size:0.9em;">Regards,<br />Fun Olympic</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Pyaris Fun Olympic</p>
            <p>52 Avenue Parmentier</p>
            <p>Paris</p>
          </div>
        </div>
      </div>
    `,
  },
};

class MailService {
  async sendOtpEmail(email: string, type: OtpType): Promise<boolean | string> {
    const code = OtpService.generateOtp();
    const savedCode = await OtpService.saveOtp(email, code, type);
    if (!savedCode) return false;

    try {
      const verified = await verifyTransporter();
      if (!verified) return false;

      const template = templates[type];
      const info = await transporter.sendMail({
        from: SENDER_EMAIL,
        to: email,
        subject: template.subject,
        html: template.body(code),
      });

      return info ? true : false;
    } catch (error) {
      throw new AppError(`Failed to send email:${error}`, 502);
    }
  }
}

export default new MailService();
