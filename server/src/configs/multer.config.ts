import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/errorHandlers.middleware';

interface FileRequest extends Request {
  fileType?: string;
}

// Error handling middleware for Multer
export const multerErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError('File size limit exceeded', 413));
    }
    return next(new AppError(`Multer error: ${err.message}`, 400));
  } else if (err) {
    return next(new AppError(err.message, 500));
  }
  next();
};

// File type validation
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes: { [key: string]: string[] } = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'video/mp4': ['.mp4'],
    'video/quicktime': ['.mov'],
    'video/x-msvideo': ['.avi'],
  };

  const ext = path.extname(file.originalname).toLowerCase();
  if (
    allowedTypes[file.mimetype] &&
    allowedTypes[file.mimetype].includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Invalid file type. Only specific image and video formats are allowed.',
        415,
      ),
    );
  }
};

// Storage configuration using multer.diskStorage
const storage = multer.diskStorage({
  destination: function (req: FileRequest, file: Express.Multer.File, cb) {
    const fileType = req.fileType || 'random';
    const uploadPath = `public/uploads/${fileType}`;
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const newFileName = `${uuidv4()}-${file.originalname.trim()}`;
    cb(null, newFileName);
  },
});

// Configure Multer for images
export const uploadImage = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit for images
  fileFilter: fileFilter,
}).single('image');

// Configure Multer for videos
export const uploadVideo = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit for videos
  fileFilter: fileFilter,
}).single('video');
