import jwt from 'jsonwebtoken';
import { User } from '../../Domain/User/User';
import { findUserByIdentityString } from '../../Infrastracture/Entity/User/UserRepository';
import { TOKEN_COOKIE_NAME } from '../AppConstants';
import { JwtPayload } from '../Type/JwtPayload';

export const extractUserFromCookies = async (cookies: Record<string, unknown>): Promise<User> => {
  const username = extractUsernameFromCookies(cookies);
  const user = await findUserByIdentityString(username);
  return user!;
};

export const extractUsernameFromCookies = (cookies: Record<string, unknown>): string => {
  // eslint-disable-next-line security/detect-object-injection
  const token = cookies[TOKEN_COOKIE_NAME] as string;
  const { username } = jwt.decode(token) as JwtPayload;
  return username;
};
