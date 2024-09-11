import { Router } from 'express';
import { checkAdmin } from '../middlewares/authentication.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { rateLimiter } from '../middlewares/rateLimit.middleware';
import { registerSchema, loginSchema } from '../constants/user.validation';
import * as UserController from '../controllers/user.controller';
import * as PasswordController from '../controllers/forgetPW.controller';
import { forgetPWSchema } from '../constants/user.validation';

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
userRouter.post('/forgetPW/send_mail', PasswordController.sendResetEmail);
userRouter.post('/forgetPW/verify_otp', PasswordController.verifyOtpCode);
userRouter.post(
  '/forgetPW/new_password',
  rateLimiter,
  validateRequest(forgetPWSchema),
  PasswordController.changePassword,
);

export default userRouter;
