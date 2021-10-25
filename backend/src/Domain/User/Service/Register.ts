import {
  findUserByEmail,
  findUserByName,
  saveUser,
} from '../../../Infrastracture/Entity/User/UserRepository';
import { UserRegisterData } from '../Dto/UserRegisterData';
import { EmailExistsError } from '../Type/EmailExistsError';
import { UsernameExistsError } from '../Type/UsernameExistsError';
import { User } from '../User';
import { hashPassword } from './PasswordUtil';

export const registerUser = async ({
  username,
  password,
  email,
}: UserRegisterData): Promise<void> => {
  await checkUserExistence(username, email);

  const passwordHash = await hashPassword(password);
  const user: User = {
    username,
    email,
    passwordHash,
  };
  await saveUser(user);
};

const checkUserExistence = async (username: string, email: string): Promise<void> => {
  await checkIfUsernameExists(username);
  await checkIfEmailExists(email);
};

const checkIfUsernameExists = async (username: string): Promise<void> => {
  const user = await findUserByName(username);
  if (user) {
    throw new UsernameExistsError();
  }
};

const checkIfEmailExists = async (email: string): Promise<void> => {
  const user = await findUserByEmail(email);
  if (user) {
    throw new EmailExistsError();
  }
};
