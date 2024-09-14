import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.reduce(
        (acc: Record<string, string[]>, detail) => {
          const key = detail.context?.key || 'unknownField';
          if (!acc[key]) {
            acc[key] = [];
          }
          switch (detail.type) {
            case 'string.empty':
            case 'any.required':
              acc[key].push(`${key} is required.`);
              break;
            case 'string.pattern.base':
              acc[key].push(`${key} is not formatted correctly.`);
              break;
            default:
              acc[key].push(`Invalid value provided for ${key}.`);
              break;
          }
          return acc;
        },
        {},
      );

      return res.status(400).json({ errors });
    }
    next();
  };
};
