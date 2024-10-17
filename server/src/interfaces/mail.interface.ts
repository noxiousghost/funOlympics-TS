import { Document } from 'mongoose';

export interface IMail extends Document {
  email: string;
  code: number;
  createdAt: Date;
}
