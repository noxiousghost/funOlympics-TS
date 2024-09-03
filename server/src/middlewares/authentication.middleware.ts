import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../schemas/user.schema';
import { envVars } from '../configs/envVars.config';

const SECRET = envVars.JWTSECRET as string;

// Middleware to extract token from the Authorization header
export const tokenExtractor = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  }
  next();
};

// Middleware to extract user information from the token
export const userExtractor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.token;
  if (token) {
    try {
      const decodedToken = jwt.verify(token, SECRET) as jwt.JwtPayload;
      const user = await User.findById(decodedToken.id);
      req.user = user ? user : null;
    } catch (error) {
      next(error);
    }
  }
  next();
};

// Middleware to check if the user is an admin
export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user || !user.isAdmin) {
    res
      .status(403)
      .json({ error: 'Access denied. Admin privileges required.' });
  } else {
    next();
  }
};
