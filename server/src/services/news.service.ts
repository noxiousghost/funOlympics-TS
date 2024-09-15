/* eslint-disable @typescript-eslint/no-explicit-any */
import News from '../schemas/news.schema';
import { AppError } from '../middlewares/errorHandlers.middleware';
import { INews } from '../models/news.model';
import { IUser } from '../models/user.model';

export const findAllNews = async () => {
  const result = await News.find({});
  if (!result) {
    throw new AppError('News not found', 404);
  }
  return result;
};

export const findNewsById = async (id: string) => {
  const result = await News.findById(id);
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
  return result;
};

export const updateNews = async (id: string, newsData: INews) => {
  const result = await News.findByIdAndUpdate(id, newsData, { new: true });
  return result;
};

export const deleteNews = async (id: string) => {
  await News.findByIdAndDelete(id);
};
