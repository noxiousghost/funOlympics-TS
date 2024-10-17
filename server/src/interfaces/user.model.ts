import { Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  phone?: string;
  email: string;
  country?: string;
  favoriteSport?: string;
  passwordHash: string;
  password?: string;
  // favourites: string[]; // these are IDs referring to 'videos' which is yet to create
  verified: boolean;
  isAdmin: boolean;
  logged_in: number;
  video_watched: number;
}
