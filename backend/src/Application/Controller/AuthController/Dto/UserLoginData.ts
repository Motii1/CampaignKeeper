import * as Joi from 'joi';
import { UserLoginData } from '../../../../Domain/User/Dto/UserLoginData';

export const userLoginDataSchema = Joi.object<UserLoginData>({
  username: Joi.string().max(255).required(),
  password: Joi.string().max(255).required(),
});
