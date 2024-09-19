/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import * as NewsService from '../services/news.service';

export const getAllNews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const news = await NewsService.findAllNews();
    res.status(200).json(news);
  } catch (error) {
    next(error);
  }
};

export const getNewsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const news = await NewsService.findNewsById(req.params.id);
    res.status(200).json(news);
  } catch (error) {
    next(error);
  }
};

export const createNews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await NewsService.createNews(req.user, req.body, req.file);
    res.status(201).json({ message: 'News created' });
  } catch (error) {
    next(error);
  }
};

export const updateNews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await NewsService.updateNews(req.params.id, req.body);
    res.status(200).json({ message: 'News updated' });
  } catch (error) {
    next(error);
  }
};

export const deleteNews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await NewsService.deleteNews(req.params.id);
    res.status(204).json({ message: 'News deleted' });
  } catch (error) {
    next(error);
  }
};
