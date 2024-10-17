import mongoose, { Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  description: string;
  image: string;
  user: mongoose.Types.ObjectId; // Reference to User model
  addedDate: Date;
}
