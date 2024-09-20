import { Router } from 'express';
import userRouter from './user.route';
import newsRouter from './news.route';
import healthRouter from './health.route';

const router = Router();
router.use('/health', healthRouter);
router.use('/users', userRouter);
router.use('/news', newsRouter);

export default router;
