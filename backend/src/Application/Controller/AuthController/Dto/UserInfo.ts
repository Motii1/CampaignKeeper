/**
 * @typedef UserInformation
 * @property {string} username - username
 * @property {string} email - email
 */

/**
 * @typedef UserInformationWithHashedImage
 * @property {string} username - username
 * @property {string} email - email
 * @property {string} image - base64 hashed image
 */

/**
 * @typedef UserUpdateInfo
 * @property {string} currentPassword - current password
 * @property {string} password - password
 * @property {string} repeatedPassword - repeated password
 */

import Joi from 'joi';
import { passwordValidationSchema } from './UserRegisterData';

export type UserInfo = {
  username: string;
  email: string;
};

export type UserInfoWithHashedImage = {
  image: string;
} & UserInfo;

export type UserUpdateInfo = {
  currentPassword: string;
  password: string;
  repeatedPassword: string;
};

export const userUpdateInfoSchema = passwordValidationSchema.keys({
  currentPassword: Joi.string().max(255).required(),
});
