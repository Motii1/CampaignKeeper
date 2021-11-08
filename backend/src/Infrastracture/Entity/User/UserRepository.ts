import { getRepository } from 'typeorm';
import { User } from '../../../Domain/User/User';
import { mapEntityToDomainObject } from './Mapping';
import { UserEntity } from './UserEntity';

// Email or username is considered as 'identity string'
export const findUserByIdentityString = async (identity: string): Promise<User | null> => {
  const userRepository = getRepository(UserEntity);
  const entity = await userRepository.findOne({
    where: [{ username: identity }, { email: identity }],
  });
  if (!entity) {
    return null;
  }

  return mapEntityToDomainObject(entity);
};

export const findUserByName = async (username: string): Promise<User | null> => {
  const userRepository = getRepository(UserEntity);
  const entity = await userRepository.findOne({ where: { username } });
  if (!entity) {
    return null;
  }
  return mapEntityToDomainObject(entity);
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const userRepository = getRepository(UserEntity);
  const entity = await userRepository.findOne({ where: { email } });
  if (!entity) {
    return null;
  }
  return mapEntityToDomainObject(entity);
};

export const saveUser = async (user: User): Promise<User> => {
  const userRepository = getRepository(UserEntity);
  const entity = await userRepository.save(user);
  return mapEntityToDomainObject(entity);
};
