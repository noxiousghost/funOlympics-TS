import app from './configs/express.config';
import { envVars } from './configs/envVars.config';
import { logger, morganMiddleware } from './configs/logger.config';
import DbConnection from './configs/db.config';
import userRouter from './routes/user.route';
const port = envVars.PORT;
DbConnection();
app.use(morganMiddleware());
app.use('/api/users', userRouter);
app.listen(port, () => {
  logger.info(`App listening on port ${port}`);
});
