import { Router } from 'express';
import { checkAdmin } from '../middlewares/authentication.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { rateLimiter } from '../middlewares/rateLimit.middleware';
import { registerSchema, loginSchema } from '../constants/user.validation';
import * as UserController from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/', checkAdmin, UserController.getAllUsers);
userRouter.get('/:id', UserController.getUserById);
userRouter.post(
  '/',
  rateLimiter,
  validateRequest(registerSchema),
  UserController.createUser,
);
userRouter.post('/verify', UserController.verifyUser);
userRouter.patch('/:id', UserController.updateUser);
userRouter.patch('/fav/:id', UserController.updateFavourites);
userRouter.post(
  '/login',
  rateLimiter,
  validateRequest(loginSchema),
  UserController.loginUser,
);

export default userRouter;
