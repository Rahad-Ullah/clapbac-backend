import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import multer, { FileFilterCallback } from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import ApiError from '../../errors/ApiError';
import s3Client from '../../config/aws-s3';
import config from '../../config';

const fileUploadHandler = () => {
  //create storage
  const storage = multerS3({
    s3: s3Client,
    bucket: config.aws.bucketName!,
    // acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, '')
          .toLowerCase()
          .split(' ')
          .join('-') +
        '-' +
        Date.now();

      let folder = '';
      switch (file.fieldname) {
        case 'image':
          folder = 'image/';
          break;
        case 'media':
          folder = 'media/';
          break;
        case 'doc':
          folder = 'doc/';
          break;
        default:
          return cb(
            new ApiError(StatusCodes.BAD_REQUEST, 'File not supported'),
          );
      }

      cb(null, folder + fileName + fileExt); // e.g., "image/my-photo-12345.jpg"
    },
  });

  //file filter
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    if (file.fieldname === 'image') {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
      ) {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Only .jpeg, .png, .jpg file supported',
          ),
        );
      }
    } else if (file.fieldname === 'media') {
      if (file.mimetype === 'video/mp4' || file.mimetype === 'audio/mpeg') {
        cb(null, true);
      } else {
        cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Only .mp4, .mp3, file supported',
          ),
        );
      }
    } else if (file.fieldname === 'doc') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new ApiError(StatusCodes.BAD_REQUEST, 'Only pdf supported'));
      }
    } else {
      cb(new ApiError(StatusCodes.BAD_REQUEST, 'This file is not supported'));
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter as any,
  }).fields([
    { name: 'image', maxCount: 3 },
    { name: 'media', maxCount: 3 },
    { name: 'doc', maxCount: 3 },
  ]);
  return upload;
};

export default fileUploadHandler;
