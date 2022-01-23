import { UserUpdateInfo } from '../../../Application/Controller/AuthController/Dto/UserInfo';
import { saveUser } from '../../../Infrastracture/Entity/User/UserRepository';
import { SamePasswordError } from '../Type/SamePasswordError';
import { WrongPasswordError } from '../Type/WrongPasswordError';
import { User } from '../User';
import { comparePassword, hashPassword } from './PasswordUtil';

export const handleDetailsUpdate = async (
  user: User,
  { password, currentPassword }: UserUpdateInfo
): Promise<void> => {
  const currentPasswordComparisonResult = await comparePassword(currentPassword, user.passwordHash);
  if (!currentPasswordComparisonResult) {
    throw new WrongPasswordError();
  }

  const passwordComparisonResult = await comparePassword(password, user.passwordHash);
  if (passwordComparisonResult) {
    throw new SamePasswordError();
  }
  const newPassword = await hashPassword(password);
  const newUser: User = { ...user, passwordHash: newPassword };
  await saveUser(newUser);
};
