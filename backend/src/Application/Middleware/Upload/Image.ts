import { Request, Response } from 'express';
import multer from 'multer';
import { tmpdir } from 'os';
import { join } from 'path';

const supportedMimetypes = ['image/png', 'image/jpg', 'image/jpeg'];

export const buildSingleImageUploader = (fileSizeLimit: number, fileFieldName: string) => {
  const upload = multer({
    limits: {
      files: 1,
      fileSize: fileSizeLimit,
      fields: 0,
    },
    storage: multer.diskStorage({
      destination: join(tmpdir(), 'ck_images'),
    }),
    fileFilter: (_, file, callback) => {
      supportedMimetypes.includes(file.mimetype)
        ? callback(null, true)
        : callback(new Error(`Only ${supportedMimetypes.join(', ')} mimetypes are allowed!`));
    },
  }).single(fileFieldName);
  return (
    req: Request,
    res: Response
  ): Promise<{ error: null; file: Express.Multer.File } | { error: Error; file: null }> =>
    new Promise((resolve, reject) => {
      upload(req, res, error => {
        if (error instanceof multer.MulterError) {
          resolve({ error, file: null });
        } else if (error) {
          reject(error);
        } else if (!req.file) {
          resolve({ error: new Error('File is not present under needed key'), file: null });
        } else {
          resolve({ file: req.file, error: null });
        }
      });
    });
};
