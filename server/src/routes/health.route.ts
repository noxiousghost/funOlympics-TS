import { Router } from 'express';
import * as HealthController from '../controllers/health.controller';
import { rateLimiter } from '../middlewares/rateLimit.middleware';

const healthRouter = Router();

healthRouter.get('/', rateLimiter, HealthController.checkHealth);

export default healthRouter;
