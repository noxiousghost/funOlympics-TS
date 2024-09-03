/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response } from 'express';
import * as UserService from '../services/user.service';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await UserService.findAllUsers();
  res.status(200).json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await UserService.findUserById(req.params.id);
  user
    ? res.status(200).json(user)
    : res.status(404).json({ error: 'User not found!' });
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const savedUser = await UserService.createUser(req.body);
    res.status(201).json(savedUser);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  const verifiedUser = await UserService.verifyUser(
    req.body.email,
    req.body.code,
  );
  verifiedUser
    ? res.status(200).json(verifiedUser)
    : res.status(400).json({ error: 'Invalid OTP or email not registered' });
};

export const updateUser = async (req: Request, res: Response) => {
  const updatedUser = await UserService.updateUser(
    req.params.id,
    req.body,
    req.user,
  );
  updatedUser
    ? res.status(200).json(updatedUser)
    : res.status(400).json({ error: 'Failed to update user!' });
};

export const updateFavourites = async (req: Request, res: Response) => {
  const result = await UserService.updateFavourites(
    req.params.id,
    req.body.videoId,
    req.user,
  );
  result.success
    ? res.status(200).json(result.data)
    : res.status(401).json({ error: result.error });
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token, userForToken } = await UserService.authenticateUser(
      email,
      password,
    );
    res.status(200).json({
      token,
      username: userForToken.username,
      country: userForToken.country,
      favoriteSport: userForToken.favoriteSport,
      email: userForToken.email,
      isAdmin: userForToken.isAdmin,
      id: userForToken.id,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
