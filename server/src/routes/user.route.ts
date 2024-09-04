import { Router } from 'express';
import {
  checkAdmin,
  userExtractor,
} from '../middlewares/authentication.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { registerSchema, loginSchema } from '../constants/user.validation';
import * as UserController from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/', userExtractor, checkAdmin, UserController.getAllUsers);
userRouter.get('/:id', UserController.getUserById);
userRouter.post(
  '/',
  validateRequest(registerSchema),
  UserController.createUser,
);
userRouter.post('/verify', UserController.verifyUser);
userRouter.patch('/:id', UserController.updateUser);
userRouter.patch('/fav/:id', UserController.updateFavourites);
userRouter.post(
  '/login',
  validateRequest(loginSchema),
  UserController.loginUser,
);

export default userRouter;
