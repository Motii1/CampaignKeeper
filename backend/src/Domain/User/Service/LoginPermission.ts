import { findUserByIdentityString } from '../../../Infrastracture/Entity/User/UserRepository';
import { UserLoginData } from '../Dto/UserLoginData';
import { User } from '../User';
import { comparePassword } from './PasswordUtil';

export const shouldLogUser = async ({
  username,
  password,
}: UserLoginData): Promise<User | null> => {
  const user = await findUserByIdentityString(username);
  return !!user && (await comparePassword(password, user?.passwordHash)) ? user : null;
};
