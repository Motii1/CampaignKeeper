import { User } from '../../../Domain/User/User';
import { UserEntity } from './UserEntity';

export const mapEntityToDomainObject = (entity: UserEntity): User => ({
  username: entity.username,
  passwordHash: entity.passwordHash,
  email: entity.email,
  id: entity.id,
  image: entity.image,
});
