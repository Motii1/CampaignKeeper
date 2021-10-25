import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { TOKEN_COOKIE_NAME } from '../../AppConstants';
import { config } from '../../Config/Config';

export const authorization = (req: Request, res: Response, next: NextFunction): void => {
  // eslint-disable-next-line security/detect-object-injection
  const token = req.cookies[TOKEN_COOKIE_NAME];
  if (!token) {
    res.status(403).json({});
    return;
  }

  try {
    jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    res.status(403).json({});
  }
};
