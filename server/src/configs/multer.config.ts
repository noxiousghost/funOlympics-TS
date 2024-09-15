import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

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
  if (err) {
    res.status(413).json({ error: err.message });
  } else {
    next();
  }
};

// File type validation
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );

  if (mimeType && extname) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'));
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
