import { Router } from 'express';
import {
  checkAdmin,
  checkValidAuth,
} from '../middlewares/authentication.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { rateLimiter } from '../middlewares/rateLimit.middleware';
import {
  registerSchema,
  loginSchema,
  updateSchema,
  forgetPWSchema,
} from '../constants/user.validation';
import * as UserController from '../controllers/user.controller';
import * as PasswordController from '../controllers/forgetPW.controller';

const userRouter = Router();

// get all users after admin login
userRouter.get('/', checkAdmin, UserController.getAllUsers);

// get user by id after user login
userRouter.get('/:id', checkValidAuth, UserController.getUserById);

// signup user
userRouter.post(
  '/',
  rateLimiter,
  validateRequest(registerSchema),
  UserController.createUser,
);
// verify otp code after signup
userRouter.post('/verify', UserController.verifyUser);

// update user after user login
userRouter.patch(
  '/:id',
  checkValidAuth,
  validateRequest(updateSchema),
  UserController.updateUser,
);

// update favourites after user login
// userRouter.patch('/fav/:id', checkValidAuth, UserController.updateFavourites);

// login user
userRouter.post(
  '/login',
  rateLimiter,
  validateRequest(loginSchema),
  UserController.loginUser,
);

// send reset email for forget password
userRouter.post('/forgetPW/send_mail', PasswordController.sendResetEmail);

// verify otp code for forget password
userRouter.post('/forgetPW/verify_otp', PasswordController.verifyOtpCode);

// change password after forget password
userRouter.post(
  '/forgetPW/new_password',
  rateLimiter,
  validateRequest(forgetPWSchema),
  PasswordController.changePassword,
);

export default userRouter;
