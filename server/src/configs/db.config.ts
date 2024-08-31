import mongoose from 'mongoose';
import { envVars } from './envVars.config';
import logger from './logger.config';
const uri = envVars.DB_URI as string;

const DbConnection = async (): Promise<void> => {
  try {
    const isConnected = await mongoose.connect(uri);
    if (isConnected) {
      logger.info(`Connected to ${uri.split('/').pop() || 'test'} database`);
    }
  } catch (err) {
    logger.error(err);
  }
};
export default DbConnection;
