import { Router } from 'express';
import { validateRequest } from '../middlewares/validation.middleware';
import { rateLimiter } from '../middlewares/rateLimit.middleware';
import { registerSchema, loginSchema } from '../constants/user.validation';
import * as AuthController from '../controllers/auth.controller';

const authRouter = Router();

// signup user
authRouter.post(
  '/signup',
  rateLimiter,
  validateRequest(registerSchema),
  AuthController.createUser,
);
// verify otp code after signup
authRouter.post('/verify', AuthController.verifyUser);

// login user
authRouter.post(
  '/login',
  rateLimiter,
  validateRequest(loginSchema),
  AuthController.loginUser,
);

export default authRouter;
