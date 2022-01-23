import * as Joi from 'joi';

export const passwordValidationPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,255}$/;

export const passwordValidationSchema = Joi.object().keys({
  password: Joi.string().max(255).pattern(passwordValidationPattern).required(),
  repeatedPassword: Joi.string().required().equal(Joi.ref('password')),
});

/**
 * @typedef UserRegisterData
 * @property {string} username
 * @property {string} password
 * @property {string} repeatedPassword - username or password
 * @property {string} email - user's password
 * @property {string} repeatedEmail - username or password
 */

export const userRegisterDataSchema = passwordValidationSchema.keys({
  username: Joi.string().min(3).max(32).required(),
  email: Joi.string().email().required(),
  repeatedEmail: Joi.string().email().required().equal(Joi.ref('email')),
});
