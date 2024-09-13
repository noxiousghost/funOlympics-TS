import User from '../schemas/user.schema';
import { AppError } from '../middlewares/errorHandlers.middleware';
import { Request, Response, NextFunction } from 'express';
const userExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone } = req.body;
    const userEmail = await User.findOne({ email });
    const userPhone = await User.findOne({ phone });
    if (userEmail || userPhone) {
      throw new AppError('User with that email or phone already exists', 400);
    }
    next();
  } catch (error) {
    next(error);
  }
};

export { userExists };
