import { getRepository } from 'typeorm';
import { Session } from '../../../Domain/Campaign/Session/Session';
import { mapEntityToDomainObject } from './Mapping';
import { SessionEntity } from './SessionEntity';

export const findSessionsByCampaignId = async (campaignId: number): Promise<Session[]> => {
  const repository = getRepository(SessionEntity);
  const entities = await repository.find({ campaignId });
  return entities.map(mapEntityToDomainObject);
};

export const findSessionById = async (id: number): Promise<Session | null> => {
  const repository = await getRepository(SessionEntity);
  const entity = await repository.findOne(id);
  if (!entity) {
    return null;
  }
  return mapEntityToDomainObject(entity);
};

export const deleteSessionById = async (id: number): Promise<void> => {
  await getRepository(SessionEntity).delete({ id });
};

export const saveSession = async (session: Omit<Session, 'id' | 'createdAt'>): Promise<Session> => {
  const entity = await getRepository(SessionEntity).save(session);
  return mapEntityToDomainObject(entity);
};
