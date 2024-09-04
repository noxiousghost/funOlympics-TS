import { Router } from 'express';
import * as PasswordController from '../controllers/forgetPW.controller';
import { validateRequest } from '../middlewares/validation.middleware';
import { rateLimiter } from '../middlewares/rateLimit.middleware';
import { forgetPWSchema } from '../constants/user.validation';

const ChangePasswordRouter = Router();

ChangePasswordRouter.post('/send_mail', PasswordController.sendResetEmail);
ChangePasswordRouter.post('/verify_otp', PasswordController.verifyOtpCode);
ChangePasswordRouter.post(
  '/new_password',
  rateLimiter,
  validateRequest(forgetPWSchema),
  PasswordController.changePassword,
);

export default ChangePasswordRouter;
