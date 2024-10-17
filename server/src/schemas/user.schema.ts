import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/user.model';

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    phone: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
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

function docTransform(
  doc: IUser,
  ret: Record<string, unknown>,
): Record<string, unknown> {
  const transformedRet: Record<string, unknown> = {
    ...ret,
    id: (ret._id as mongoose.Types.ObjectId).toString(),
  };
  delete transformedRet._id;
  delete transformedRet.passwordHash; // password hash is never exposed
  return transformedRet;
}

const User = mongoose.model<IUser>('users', userSchema);
export default User;
