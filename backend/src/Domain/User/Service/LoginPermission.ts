import { findUserByName } from '../../../Infrastracture/Entity/User/UserRepository';
import { UserLoginData } from '../Dto/UserLoginData';
import { comparePassword } from './PasswordUtil';

export const shouldLogUser = async ({ username, password }: UserLoginData): Promise<boolean> => {
  const user = await findUserByName(username);
  return !!user && comparePassword(password, user.passwordHash);
};
