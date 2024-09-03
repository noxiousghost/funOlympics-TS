import mongoose, { Schema } from 'mongoose';
import { IUser } from '../models/user.model';

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true },
    country: { type: String },
    favoriteSport: { type: String },
    passwordHash: { type: String, required: true },
    // favourites: [{ type: Schema.Types.ObjectId, ref: 'videos' }],
    verified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    logged_in: { type: Number, default: 0 },
    video_watched: { type: Number, default: 0 },
  },
  {
    toJSON: { virtuals: true, versionKey: false, transform: docTransform },
  },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function docTransform(doc: IUser, ret: any): any {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.passwordHash; // password hash is never exposed
}

const User = mongoose.model<IUser>('users', userSchema);
export default User;
