/* eslint-disable @typescript-eslint/no-explicit-any */
import News from '../schemas/news.schema';
import { AppError } from '../middlewares/errorHandlers.middleware';
import { INews } from '../models/news.model';
import { IUser } from '../models/user.model';
import { logger } from '../configs/logger.config';
import path from 'path';
import fs from 'fs';

export const findAllNews = async () => {
  const result = await News.find({}).populate('user', {
    username: 1,
    email: 1,
  });
  if (!result) {
    throw new AppError('News not found', 404);
  }
  return result;
};

export const findNewsById = async (id: string) => {
  const result = await News.findById(id).populate('user', {
    username: 1,
    email: 1,
  });
  if (!result) {
    throw new AppError('News not found', 404);
  }
  return result;
};

export const createNews = async (user: IUser, newsData: INews, file: any) => {
  let imagePath;
  const { path } = file;
  if (path) {
    imagePath = path.replace('public', '');
  }
  const news = await new News({
    title: newsData.title,
    description: newsData.description,
    image: imagePath,
    user: user.id,
  }).populate('user', { username: 1, email: 1 });
  const result = await await news.save();
  if (!result) {
    throw new AppError('News not created', 400);
  }
  logger.info(`${result.title} news created`);
  return result;
};

export const updateNews = async (id: string, newsData: INews) => {
  const newsExists = await News.findById(id);
  if (!newsExists) {
    throw new AppError('News not found', 404);
  }
  const result = await News.findByIdAndUpdate(id, newsData);
  const updatedData = await News.findById(id);
  if (!result) {
    throw new AppError('News not updated', 400);
  }
  logger.info(`${result.title} news updated`);
  return updatedData;
};

export const deleteNews = async (id: string) => {
  const newsExists = await News.findById(id);
  if (!newsExists) {
    throw new AppError('News not found', 404);
  }
  const deletePath = path.join('public', newsExists.image);
  if (fs.existsSync(deletePath)) {
    fs.rmSync(deletePath); // delete the image associated with the news
  } else {
    logger.warn('Image not found, skipping its deletion');
  }
  const result = await News.findByIdAndDelete(id);
  if (!result) {
    throw new AppError('News not deleted', 400);
  }
  logger.info(`${result.title} news deleted`);
  return result;
};
