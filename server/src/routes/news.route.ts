import { Router } from 'express';
import { checkAdmin } from '../middlewares/authentication.middleware';
import * as NewsController from '../controllers/news.controller';
import { uploadImage } from '../configs/multer.config';
import { setFileType } from '../middlewares/setFileType.middleware';
import { multerErrorHandler } from '../middlewares/errorHandlers.middleware';
import { sanitizeFileName } from '../middlewares/sanitizeFileName.middleware';
import { newsExists } from '../middlewares/exists.middleware';

const newsRouter = Router();

newsRouter.get('/', NewsController.getAllNews);
newsRouter.get('/:id', NewsController.getNewsById);
newsRouter.post(
  '/',
  checkAdmin,
  setFileType,
  uploadImage,
  sanitizeFileName,
  multerErrorHandler,
  newsExists,
  NewsController.createNews,
);
newsRouter.patch('/:id', checkAdmin, NewsController.updateNews);
newsRouter.delete('/:id', checkAdmin, NewsController.deleteNews);

export default newsRouter;
