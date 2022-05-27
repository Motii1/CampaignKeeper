import { getRepository } from 'typeorm';
import { Event } from '../../../Domain/Campaign/Event/Event';
import { CharactersMetadataEntity } from './CharactersMetadataEntity';
import { DescriptionMetadataEntity } from './DescriptionMetadataEntity';
import { EventEntity } from './EventEntity';
import { mapEntityToDomainObject } from './Mapping';
import { PlaceMetadataEntity } from './PlaceMetadataEntity';

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

export const saveEvent = async (event: Omit<Event, 'id'> & { id?: number }): Promise<Event> => {
  const repo = getRepository(EventEntity);
  if (!event.id) {
    const entity = await repo.save(event);
    return mapEntityToDomainObject(entity);
  }
  const existing = await repo.findOne(event.id);
  if (!existing) {
    throw new Error(`Cannot update event with id ${event.id}`);
  }
  await Promise.all([
    getRepository(DescriptionMetadataEntity).delete({ eventId: existing.id }),
    getRepository(PlaceMetadataEntity).delete({ eventId: existing.id }),
    getRepository(CharactersMetadataEntity).delete({ eventId: existing.id }),
  ]);

  const entity = await repo.save(event);
  return mapEntityToDomainObject(entity);
};
