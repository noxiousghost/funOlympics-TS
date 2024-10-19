/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import * as UserService from '../services/user.service';

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await UserService.findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await UserService.findUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await UserService.updateUser(req.params.id, req.body);
    res.status(200).json({ message: 'user updated successfully' });
  } catch (error) {
    next(error);
  }
};

// todo work on this after video feature is added
// export const updateFavourites = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     await UserService.updateFavourites(
//       req.params.id,
//       req.body.videoId,
//       req.user,
//     );
//     res.status(200).json({ message: 'favourites updated successfully' });
//   } catch (error) {
//     next(error);
//   }
// };
//

// Login user
