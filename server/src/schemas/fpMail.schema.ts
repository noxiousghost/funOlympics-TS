import mongoose from 'mongoose';
import { IfpMail } from '../interfaces/fpMail.interface';

const FpMailSchema = new mongoose.Schema<IfpMail>({
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  code: {
    type: Number,
    required: [true, 'Code is required'],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    expires: '10m',
    default: Date.now,
  },
});

FpMailSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const FpMail = mongoose.model<IfpMail>('forget_pws', FpMailSchema);
export default FpMail;
