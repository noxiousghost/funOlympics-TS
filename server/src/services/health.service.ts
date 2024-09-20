/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';
import os from 'os';
import { AppError } from '../middlewares/errorHandlers.middleware';

const checkDatabaseConnection = async () => {
  try {
    const status = mongoose.connection.readyState;
    return {
      status: status === 1 ? 'connected' : 'disconnected',
      responseTime: await measureDatabaseResponseTime(),
    };
  } catch (error) {
    throw new AppError('Database connection is not established', 500);
  }
};

const measureDatabaseResponseTime = async () => {
  const start = process.hrtime();
  if (mongoose.connection.db) {
    await mongoose.connection.db.admin().ping();
  } else {
    throw new AppError('unable to check database status', 500);
  }
  const [seconds, nanoseconds] = process.hrtime(start);
  return `${(seconds * 1000 + nanoseconds / 1e6).toFixed(2)}ms`;
};

const getSystemInfo = () => {
  return {
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    loadAverage: os.loadavg(),
  };
};

export const getHealthStatus = async () => {
  const dbStatus = await checkDatabaseConnection();
  const systemInfo = getSystemInfo();
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || 'unknown',
    database: dbStatus,
    system: systemInfo,
  };
};
