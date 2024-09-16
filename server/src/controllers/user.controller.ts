/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import * as UserService from '../services/user.service';
import { catchAsync } from '../middlewares/errorHandlers.middleware';

// Get all users
export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserService.findAllUsers();
    res.status(200).json(users);
  },
);

// Get user by ID
export const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.findUserById(req.params.id, req.user);
    res.status(200).json(user);
  },
);

// Create user
export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await UserService.createUser(req.body);
    res.status(201).json({ message: 'user created successfully' });
  },
);

// Verify user
export const verifyUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await UserService.verifyUser(req.body.email, req.body.code);
    res.status(200).json({ message: 'user verified successfully' });
  },
);

// Update user
export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await UserService.updateUser(req.params.id, req.body);
    res.status(200).json({ message: 'user updated successfully' });
  },
);

// todo work on this after video feature is added
// export const updateFavourites = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     await UserService.updateFavourites(
//       req.params.id,
//       req.body.videoId,
//       req.user,
//     );
//     res.status(200).json({ message: 'favourites updated successfully' });
//   },
// );

// Login user
export const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const { token } = await UserService.authenticateUser(email, password);

    res.status(200).json({
      token,
      message: 'Logged in successfully',
    });
  },
);
