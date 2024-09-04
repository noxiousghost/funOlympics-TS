/* eslint-disable @typescript-eslint/no-explicit-any */
import FpMail from '../schemas/fpMail.schema';

class FpMailService {
  async saveToken(email: string, code: number): Promise<any> {
    const exists = await FpMail.findOne({ email });
    if (exists) {
      exists.code = code;
      await exists.save();
      return exists;
    } else {
      const data = { email, code };
      const response = await FpMail.create(data);
      return response || false;
    }
  }

  async find(email: string): Promise<any> {
    const response = await FpMail.findOne({ email });
    return response || false;
  }
}

export default new FpMailService();
