import * as Joi from 'joi';
import { UserRegisterData } from '../../../../Domain/User/Dto/UserRegisterData';

const passwordValidationPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,255}$/;

export const userRegisterDataSchema = Joi.object<UserRegisterData>({
  username: Joi.string().max(255).required(),
  password: Joi.string().max(255).pattern(passwordValidationPattern).required(),
  repeatedPassword: Joi.string().required().equal(Joi.ref('password')),
  email: Joi.string().email().required(),
  repeatedEmail: Joi.string().email().required().equal(Joi.ref('email')),
});
