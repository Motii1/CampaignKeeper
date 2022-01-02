import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import * as path from 'path';
import { handleUserImagePersistance } from '../../../Domain/User/Service/Image';
import { authorization } from '../../Middleware/Auth/Authorization';
import { buildSingleImageUploader } from '../../Middleware/Upload/Image';
import { extractUserFromCookies } from '../../Util/Authorization';
import { loadImage } from '../../Util/Image';
import { IController } from '../IController';

const MAX_FILE_SIZE_LIMIT = 500000;
const IMAGE_FILE_FIELD_NAME = 'image-file';
const USER_IMAGE_DEFAULT_PATH = path.resolve(
  __dirname,
  path.join('..', '..', '..', 'Common', 'Image', 'User.png')
);

enum UserRoutes {
  Details = '/details',
  Image = '/image',
  Status = '/status',
}

export class UserController implements IController {
  private router: Router;

  constructor() {
    this.router = Router();
    this.declareRoutes();
  }

  private declareRoutes = (): void => {
    this.router.get(UserRoutes.Image, authorization, asyncHandler(this.getImageHandler));
    this.router.put(UserRoutes.Image, authorization, asyncHandler(this.uploadImageHandler));
    this.router.get(UserRoutes.Details, authorization, asyncHandler(this.detailsHandler));
    this.router.get(UserRoutes.Status, authorization, asyncHandler(this.statusHandler));
  };

  /**
   * @route GET /user/image
   * @group user - Operations related to user data
   * @produces image/*
   * @returns {file} 200 - User avatar or placeholder if avatar is not set
   * @security cookieAuth
   */
  private getImageHandler = async (req: Request, res: Response): Promise<void> => {
    const user = await extractUserFromCookies(req.cookies);
    const image = user.image ?? (await loadImage(USER_IMAGE_DEFAULT_PATH));
    res.end(image, 'binary');
  };

  /**
   * @route PUT /user/image
   * @group user - Operations related to user data
   * @consumes multipart/form-data
   * @param {file} image-file.formData - image
   * @returns {EmptyResponse.model} 200 - Image succesfully saved
   * @returns {Message.model} 400 - Invalid file provided
   * @security cookieAuth
   */
  private uploadImageHandler = async (req: Request, res: Response): Promise<void> => {
    const { file, error } = await buildSingleImageUploader(
      MAX_FILE_SIZE_LIMIT,
      IMAGE_FILE_FIELD_NAME
    )(req, res);
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }
    const user = await extractUserFromCookies(req.cookies);
    await handleUserImagePersistance(file!, user);
    res.status(200).json({});
  };

  /**
   * @route GET /user/details
   * @group user - Operations related to user data
   * @returns {UserInformation.model} 200 - User details
   * @security cookieAuth
   */
  private detailsHandler = async (req: Request, res: Response): Promise<void> => {
    const user = await extractUserFromCookies(req.cookies);
    res.status(200).json({ username: user!.username, email: user!.email });
  };

  /**
   * @route GET /user/status
   * @group user - Operations related to user data
   * @returns {EmptyResponse.model} 200 - User can access restricted page
   * @security cookieAuth
   */
  private statusHandler = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({});
  };

  getRouter = (): Router => this.router;
}
