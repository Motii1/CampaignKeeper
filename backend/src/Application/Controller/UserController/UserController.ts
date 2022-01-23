import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import * as path from 'path';
import { handleDetailsUpdate } from '../../../Domain/User/Service/Details';
import { handleUserImagePersistance } from '../../../Domain/User/Service/Image';
import { isSamePasswordError } from '../../../Domain/User/Type/SamePasswordError';
import { isWrongPasswordError } from '../../../Domain/User/Type/WrongPasswordError';
import { User } from '../../../Domain/User/User';
import { authorization } from '../../Middleware/Auth/Authorization';
import { buildSingleImageUploader } from '../../Middleware/Upload/Image';
import { extractUserFromCookies } from '../../Util/Authorization';
import { loadImage } from '../../Util/Image';
import { UserUpdateInfo, userUpdateInfoSchema } from '../AuthController/Dto/UserInfo';
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
    this.router.put(UserRoutes.Details, authorization, this.detailsUpdateHandler);
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
    const image = await this.loadUserImage(user);
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
   * @returns {UserInformationWithHashedImage.model} 200 - User details
   * @security cookieAuth
   */
  private detailsHandler = async (req: Request, res: Response): Promise<void> => {
    const user = await extractUserFromCookies(req.cookies);
    const hashedImage = (await this.loadUserImage(user)).toString('base64');
    res.status(200).json({ username: user.username, email: user.email, image: hashedImage });
  };

  /**
   * @route PUT /user/details
   * @group user - Operations related to user data
   * @param {UserUpdateInfo.model} data.body.required - user's details data
   * @returns {EmptyResponse.model} 200 - User details
   * @returns {Message.model} 401 - Message with unsatisfied constraint
   * @security cookieAuth
   */
  private detailsUpdateHandler = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = userUpdateInfoSchema.validate(req.body);
    if (error) {
      res.status(400).json({});
      return;
    }
    const body = value as UserUpdateInfo;
    const user = await extractUserFromCookies(req.cookies);
    try {
      await handleDetailsUpdate(user, body);
    } catch (error) {
      if (isWrongPasswordError(error)) {
        res.status(401).json({ message: 'Wrong current password given!' });
        return;
      }
      if (isSamePasswordError(error)) {
        res.status(401).json({ message: 'New password cannot be the same as current password' });
        return;
      }
    }
    res.status(200).json({});
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

  private loadUserImage = async (user: User): Promise<Buffer> =>
    user.image ?? (await loadImage(USER_IMAGE_DEFAULT_PATH));

  getRouter = (): Router => this.router;
}
