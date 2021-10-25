import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
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
import { IController } from '../IController';
import { userLoginDataSchema } from './Dto/UserLoginData';
import { userRegisterDataSchema } from './Dto/UserRegisterData';

const DAY_IN_MS = 24 * 60 * 60 * 1000; // 24 hours

enum AuthRoutes {
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

  private loginHandler = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = userLoginDataSchema.validate(req.body);
    if (error) {
      logger.warn(`Received user login data in the wrong format: ${error.message}`);
      res.status(400).json({});
      return;
    }
    const userLoginData = value as UserLoginData;
    const loginPermission = await shouldLogUser(userLoginData);
    if (loginPermission) {
      const token = this.createJwtToken(userLoginData);
      const tokenOptions = {
        httpOnly: true,
        secure: config.nodeEnv === NodeEnv.Production,
        maxAge: DAY_IN_MS,
      };
      res.cookie(TOKEN_COOKIE_NAME, token, tokenOptions).status(200).json({});
      return;
    }

    res.status(401).json({});
  };

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

  private logoutHandler = (_req: Request, res: Response): void => {
    res.clearCookie(TOKEN_COOKIE_NAME).status(200).json({});
  };

  private createJwtToken = ({ username }: UserLoginData): string =>
    jwt.sign({ username }, config.jwtSecret);

  getRouter = (): Router => this.router;
}
