import { Document } from 'mongoose';

export interface IfpMail extends Document {
  email: string;
  code: number;
  verified: boolean;
  createdAt: Date;
}
