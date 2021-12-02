import * as fs from 'fs/promises';
import { saveUser } from '../../../Infrastracture/Entity/User/UserRepository';
import { User } from '../User';

export const handleUserImagePersistance = async (
  { path }: Express.Multer.File,
  user: User
): Promise<void> => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const image = await fs.readFile(path);
  await saveUser({ ...user!, image });
};
