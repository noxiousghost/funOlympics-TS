import app from './configs/express.config';
import { envVars } from './configs/envVars.config';
import { logger, morganMiddleware } from './configs/logger.config';
import {
  userExtractor,
  tokenExtractor,
} from './middlewares/authentication.middleware';
import DbConnection from './configs/db.config';
import userRouter from './routes/user.route';
import newsRouter from './routes/news.route';
import helmet from 'helmet';
import { unknownEndpoint } from './middlewares/unknownEndpoint.middleware';
import { errorHandler } from './middlewares/errorHandlers.middleware';

const port = envVars.PORT;
DbConnection();

app.use(helmet());
app.use(morganMiddleware());
app.use(tokenExtractor);
app.use(userExtractor);

app.use('/api/users', userRouter);
app.use('/api/news', newsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`App listening on port ${port}`);
});
