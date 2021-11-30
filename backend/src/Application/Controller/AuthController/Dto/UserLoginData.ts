import * as Joi from 'joi';
import { UserLoginData } from '../../../../Domain/User/Dto/UserLoginData';

/**
 * @typedef UserLoginData
 * @property {string} username - username or password
 * @property {string} password - user's password
 */

export const userLoginDataSchema = Joi.object<UserLoginData>({
  username: Joi.string().max(255).required(),
  password: Joi.string().max(255).required(),
});
