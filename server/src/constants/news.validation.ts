import Joi from 'joi';

export const createNews = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  // image is validated by multer, no need to validate from here
  user: Joi.string(),
  addedDate: Joi.date().default(Date.now),
});

export const updateNews = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().min(10).optional(),
  user: Joi.string(),
});
