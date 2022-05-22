import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import * as path from 'path';
import { logger } from '../../../Common/Logger/Logger';
import { NodeEnv } from '../../../Common/Type/NodeEnv';
import { UserLoginData } from '../../../Domain/User/Dto/UserLoginData';
import { UserRegisterData } from '../../../Domain/User/Dto/UserRegisterData';
import { shouldLogUser } from '../../../Domain/User/Service/LoginPermission';
import { registerUser } from '../../../Domain/User/Service/Register';
import { isEmailExistsError } from '../../../Domain/User/Type/EmailExistsError';
import { isUsernameExistsError } from '../../../Domain/User/Type/UsernameExistsError';
import { TOKEN_COOKIE_NAME } from '../../AppConstants';
import { config } from '../../Config/Config';
import { authorization } from '../../Middleware/Auth/Authorization';
import { JwtPayload } from '../../Type/JwtPayload';
import { loadImage } from '../../Util/Image';
import { IController } from '../IController';
import { UserInfo } from './Dto/UserInfo';
import { userLoginDataSchema } from './Dto/UserLoginData';
import { userRegisterDataSchema } from './Dto/UserRegisterData';

const DAY_IN_MS = 24 * 60 * 60 * 1000; // 24 hours
const USER_IMAGE_DEFAULT_PATH = path.resolve(
  __dirname,
  path.join('..', '..', '..', 'Common', 'Image', 'User.png')
);

export enum AuthRoutes {
  Login = '/login',
  Register = '/register',
  Logout = '/logout',
}

export class AuthController implements IController {
  private router: Router;

  constructor() {
    this.router = Router();
    this.declareRoutes();
  }

  private declareRoutes = (): void => {
    this.router.post(AuthRoutes.Login, asyncHandler(this.loginHandler));
    this.router.post(AuthRoutes.Register, asyncHandler(this.registerHandler));
    this.router.post(AuthRoutes.Logout, authorization, this.logoutHandler);
  };

  /**
   * @route POST /auth/login
   * @group auth - Operations related to user authentication and authorization
   * @param {UserLoginData.model} data.body.required - user's authentication data
   * @returns {UserInformation.model} 200 - User information
   * @returns {EmptyResponse.model} 400 - Data in wrong format
   * @returns {EmptyResponse.model} 401 - Invalid credentials
   */
  private loginHandler = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = userLoginDataSchema.validate(req.body);
    if (error) {
      logger.warn(`Received user login data in the wrong format: ${error.message}`);
      res.status(400).json({});
      return;
    }
    const userLoginData = value as UserLoginData;
    const userWithLoginPermission = await shouldLogUser(userLoginData);
    if (userWithLoginPermission) {
      const token = this.createJwtToken(userLoginData);
      const tokenOptions = {
        httpOnly: true,
        secure: config.nodeEnv === NodeEnv.Production,
        maxAge: DAY_IN_MS,
      };
      const image = userWithLoginPermission.image ?? (await loadImage(USER_IMAGE_DEFAULT_PATH));
      const userInfo: UserInfo = {
        username: userWithLoginPermission.username,
        email: userWithLoginPermission.email,
        image: image.toString('base64'),
      };
      res.cookie(TOKEN_COOKIE_NAME, token, tokenOptions).status(200).json(userInfo);
      return;
    }

    res.status(401).json({});
  };

  /**
   * @route POST /auth/register
   * @group auth - Operations related to user authentication and authorization
   * @param {UserRegisterData.model} data.body.required - user's register data
   * @returns 200 - Successful registration or message about conflict with existing data
   * @returns {EmptyResponse.model} 400 - Data in wrong format
   */
  private registerHandler = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = userRegisterDataSchema.validate(req.body);
    if (error) {
      logger.warn(`Received user register data in the wrong format: ${error.message}`);
      res.status(400).json({});
      return;
    }
    const userRegisterData = value as UserRegisterData;
    try {
      await registerUser(userRegisterData);
    } catch (error) {
      if (isUsernameExistsError(error)) {
        res.status(200).json({ message: 'User with given username already exists' });
        return;
      }
      if (isEmailExistsError(error)) {
        res.status(200).json({ message: 'User with given email already exists' });
        return;
      }
      throw error;
    }

    res.status(200).json({});
  };

  /**
   * @route POST /auth/logout
   * @group auth - Operations related to user authentication and authorization
   * @returns {EmptyResponse.model} 200 - Successful logout
   * @security cookieAuth
   */
  private logoutHandler = (_req: Request, res: Response): void => {
    res.clearCookie(TOKEN_COOKIE_NAME).status(200).json({});
  };

  private createJwtToken = ({ username }: JwtPayload): string =>
    jwt.sign({ username }, config.jwtSecret);

  getRouter = (): Router => this.router;
}
