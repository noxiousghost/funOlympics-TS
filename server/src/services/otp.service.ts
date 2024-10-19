/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from 'mongoose';
import Mail from '../schemas/mail.schema';
import FpMail from '../schemas/fpMail.schema';

export enum OtpType {
  SIGNUP = 'signup',
  FORGOT_PASSWORD = 'forgot_password',
}

class OtpService {
  private getModel(type: OtpType): Model<any> {
    return type === OtpType.SIGNUP ? Mail : FpMail;
  }

  generateOtp(): number {
    return 100000 + Math.floor(Math.random() * 900000);
  }

  async saveOtp(email: string, code: number, type: OtpType): Promise<any> {
    const Model = this.getModel(type);
    const exists = await Model.findOne({ email });
    if (exists) {
      exists.code = code;
      await exists.save();
      return exists;
    } else {
      const data = { email, code };
      const response = await Model.create(data);
      return response || false;
    }
  }

  async findOtp(email: string, type: OtpType): Promise<any> {
    const Model = this.getModel(type);
    const response = await Model.findOne({ email });
    return response || false;
  }
}

export default new OtpService();
