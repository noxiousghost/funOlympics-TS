// src/routes/user.routes.ts
import { Router } from 'express';
import { checkAdmin } from '../middlewares/authentication.middleware';
import * as UserController from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/', checkAdmin, UserController.getAllUsers);
userRouter.get('/:id', UserController.getUserById);
userRouter.post('/', UserController.createUser);
userRouter.post('/verify', UserController.verifyUser);
userRouter.patch('/:id', UserController.updateUser);
userRouter.patch('/fav/:id', UserController.updateFavourites);

export default userRouter;
