import { getRepository } from 'typeorm';
import { Event } from '../../../Domain/Campaign/Event/Event';
import { EventEntity } from './EventEntity';
import { mapEntityToDomainObject } from './Mapping';

export const findEventById = async (id: number): Promise<Event | null> => {
  const entity = await getRepository(EventEntity).findOne({ where: { id } });
  return entity ? mapEntityToDomainObject(entity) : null;
};

export const findRelatedEvents = async (
  id: number
): Promise<Required<Pick<Event, 'children' | 'parents'>>> => {
  const qb = await getRepository(EventEntity).createQueryBuilder('event');
  qb.leftJoinAndSelect('event.children', 'children');
  qb.leftJoinAndSelect('event.parents', 'parents');
  qb.where('event.id = :id', { id });

  const entity = await qb.getOneOrFail();
  const event = mapEntityToDomainObject(entity);
  return { children: event.children!, parents: event.parents! };
};

export const findEventsBySessionIdWithRelations = async (sessionId: number): Promise<Event[]> => {
  const queryBuilder = getRepository(EventEntity).createQueryBuilder('event');
  queryBuilder.leftJoinAndSelect('event.placeMetadataArray', 'placeMetadataArray');
  queryBuilder.leftJoinAndSelect('event.charactersMetadataArray', 'charactersMetadataArray');
  queryBuilder.leftJoinAndSelect('event.descriptionMetadataArray', 'descriptionMetadataArray');
  queryBuilder.leftJoinAndSelect('event.children', 'children');
  queryBuilder.leftJoinAndSelect('event.parents', 'parents');

  queryBuilder.where('event.sessionId = :sessionId', { sessionId });
  const entites = await queryBuilder.getMany();
  return entites.map(mapEntityToDomainObject);
};

export const deleteEventById = async (id: number): Promise<void> => {
  await getRepository(EventEntity).delete({ id });
};

export const saveEvent = async (event: Omit<Event, 'id'>): Promise<Event> => {
  const entity = await getRepository(EventEntity).save(event);
  return mapEntityToDomainObject(entity);
};
