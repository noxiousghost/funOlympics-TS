// src/routes/user.routes.ts
import { Router } from 'express';
import {
  checkAdmin,
  userExtractor,
} from '../middlewares/authentication.middleware';
import * as UserController from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/', userExtractor, checkAdmin, UserController.getAllUsers);
userRouter.get('/:id', UserController.getUserById);
userRouter.post('/', UserController.createUser);
userRouter.post('/verify', UserController.verifyUser);
userRouter.patch('/:id', UserController.updateUser);
userRouter.patch('/fav/:id', UserController.updateFavourites);
userRouter.post('/login', UserController.loginUser);

export default userRouter;
