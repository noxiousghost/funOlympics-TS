import { Router } from 'express';
import {
  checkAdmin,
  checkValidAuth,
} from '../middlewares/authentication.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { rateLimiter } from '../middlewares/rateLimit.middleware';
import { updateSchema, forgetPWSchema } from '../constants/user.validation';
import * as UserController from '../controllers/user.controller';
import * as PasswordController from '../controllers/forgetPW.controller';

const userRouter = Router();

// get all users after admin login
userRouter.get('/', checkAdmin, UserController.getAllUsers);

// get user by id after user login
userRouter.get('/:id', checkValidAuth, UserController.getUserById);

// update user after user login
userRouter.patch(
  '/edit/:id',
  checkValidAuth,
  validateRequest(updateSchema),
  UserController.updateUser,
);

// update favourites after user login
// userRouter.patch('/fav/:id', checkValidAuth, UserController.updateFavourites);

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
