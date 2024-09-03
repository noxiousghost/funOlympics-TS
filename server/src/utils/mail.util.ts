/* eslint-disable @typescript-eslint/no-explicit-any */
import Mail from '../schemas/mail.schema';

class MailService {
  async saveToken(email: string, code: number): Promise<any> {
    const exists = await Mail.findOne({ email });
    if (exists) {
      exists.code = code;
      await exists.save();
      return exists;
    } else {
      const data = { email, code };
      const response = await Mail.create(data);
      return response || false;
    }
  }

  async find(email: string): Promise<any> {
    const response = await Mail.findOne({ email });
    return response || false;
  }
}

export default new MailService();
