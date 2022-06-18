import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../../Application/Config/Config';
import { SALT_ROUNDS } from '../../Domain/User/Service/PasswordUtil';
import { User } from '../../Domain/User/User';
import { saveUser } from '../../Infrastracture/Entity/User/UserRepository';

export const MOCKED_AUTH_TOKEN = jwt.sign({ username: 'RANDOM' }, config.jwtSecret);

export const MOCKED_USER_PASS = 'RANDOM';
export const MOCKED_USER_ID = 1;
export const MOCKED_USER: User = {
  username: 'RANDOM',
  passwordHash: bcrypt.hashSync(MOCKED_USER_PASS, SALT_ROUNDS),
  email: 'RANDOM@gmail.com',
  image: null,
  id: MOCKED_USER_ID,
};

export const insertMockedUser = async (): Promise<void> => {
  await saveUser(MOCKED_USER);
};
