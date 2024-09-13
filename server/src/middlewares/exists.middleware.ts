import User from '../schemas/user.schema';
import { AppError } from '../middlewares/errorHandlers.middleware';
import { Request, Response, NextFunction } from 'express';

const userExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone } = req.body;
    const userId = req.params.id;
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      throw new AppError('User not found', 404);
    }

    // Check only if the email is different from the current one
    if (email && email !== currentUser.email) {
      const userEmail = await User.findOne({ email });
      if (userEmail) {
        throw new AppError('User with that email already exists', 400);
      }
    }

    // Check only if the phone is different from the current one
    if (phone && phone !== currentUser.phone) {
      const userPhone = await User.findOne({ phone });
      if (userPhone) {
        throw new AppError('User with that phone number already exists', 400);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export { userExists };
