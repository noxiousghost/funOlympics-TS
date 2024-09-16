import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';
import { AppError } from '../middlewares/errorHandlers.middleware';

interface FileRequest extends Request {
  fileType?: string;
}

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

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req: FileRequest, file: Express.Multer.File, cb) {
    const fileType = req.fileType || 'misc';
    const uploadPath = path.join('public', 'uploads', fileType);
    fs.promises
      .mkdir(uploadPath, { recursive: true })
      .then(() => cb(null, uploadPath))
      .catch((err) => cb(err, uploadPath));
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const fileHash = crypto.createHash('md5').update(uuidv4()).digest('hex'); // for unique file name
    const ext = path.extname(file.originalname);
    const newFileName = `${fileHash}${ext}`;
    cb(null, newFileName);
  },
});

// for images
export const uploadImage = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit for images
  fileFilter: fileFilter,
}).single('image');

// for videos
export const uploadVideo = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit for videos
  fileFilter: fileFilter,
}).single('video');
