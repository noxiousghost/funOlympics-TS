import { Router } from 'express';
import { checkAdmin } from '../middlewares/authentication.middleware';
import * as NewsController from '../controllers/news.controller';
import { uploadImage, multerErrorHandler } from '../configs/multer.config';
import { setFileType } from '../middlewares/setFileType.middleware';

const newsRouter = Router();

newsRouter.get('/', NewsController.getAllNews);
newsRouter.get('/:id', NewsController.getNewsById);
newsRouter.post(
  '/',
  checkAdmin,
  setFileType,
  uploadImage,
  multerErrorHandler,
  NewsController.createNews,
);
newsRouter.patch('/:id', checkAdmin, NewsController.updateNews);
newsRouter.delete('/:id', checkAdmin, NewsController.deleteNews);

export default newsRouter;
