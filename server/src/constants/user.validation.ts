import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}'))
    .required(),
  country: Joi.string().required(),
  favoriteSport: Joi.string().optional(),
  phone: Joi.string()
    .regex(/^[0-9]{10}$/)
    .optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
