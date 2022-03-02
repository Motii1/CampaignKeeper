import { Session } from '../../../Domain/Campaign/Session/Session';
import { SessionEntity } from './SessionEntity';

// @todo adjust whole file
export const mapEntityToDomainObject = (entity: SessionEntity): Session => ({ id: entity.id });
