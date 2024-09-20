import { Router } from 'express';
import userRouter from './user.route';
import newsRouter from './news.route';

const router = Router();

router.use('/users', userRouter);
router.use('/news', newsRouter);

export default router;
