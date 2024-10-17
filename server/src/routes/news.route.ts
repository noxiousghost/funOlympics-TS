import { Router } from 'express';
import { checkAdmin } from '../middlewares/authentication.middleware';
import * as NewsController from '../controllers/news.controller';
import { uploadImage } from '../configs/multer.config';
import { setFileType } from '../middlewares/setFileType.middleware';
import { sanitizeFileName } from '../middlewares/sanitizeFileName.middleware';
import { newsExists } from '../middlewares/exists.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createNews, updateNews } from '../constants/news.validation';

const newsRouter = Router();

newsRouter.get('/', NewsController.getAllNews);
newsRouter.get('/:id', NewsController.getNewsById);
newsRouter.post(
  '/create',
  checkAdmin,
  setFileType,
  uploadImage,
  sanitizeFileName,
  newsExists,
  validateRequest(createNews),
  NewsController.createNews,
);
newsRouter.patch(
  '/edit/:id',
  checkAdmin,
  validateRequest(updateNews),
  NewsController.updateNews,
);
newsRouter.delete('/delete/:id', checkAdmin, NewsController.deleteNews);

export default newsRouter;
