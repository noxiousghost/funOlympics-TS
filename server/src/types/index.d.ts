import 'express';
import { IUser } from '../schemas/user.schema';

declare global {
  namespace Express {
    interface Request {
      token?: string;
      user?: IUser;
      fileType?: string;
    }
  }
}
