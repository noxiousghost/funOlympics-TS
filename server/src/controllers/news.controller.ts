/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import * as NewsService from '../services/news.service';
import { catchAsync } from '../middlewares/errorHandlers.middleware';

export const getAllNews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const news = await NewsService.findAllNews();
    res.status(200).json(news);
  },
);
export const getNewsById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const news = await NewsService.findNewsById(req.params.id);
    res.status(200).json(news);
  },
);

export const createNews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await NewsService.createNews(req.user, req.body, req.file);
    res.status(201).json({ message: 'News created' });
  },
);

export const updateNews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await NewsService.updateNews(req.params.id, req.body);
    res.status(200).json({ message: 'News updated' });
  },
);

export const deleteNews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await NewsService.deleteNews(req.params.id);
    res.status(204).json({ message: 'News deleted' });
  },
);
