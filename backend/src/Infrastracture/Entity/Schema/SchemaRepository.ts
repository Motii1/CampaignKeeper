import { getRepository } from 'typeorm';
import { Schema } from '../../../Domain/Campaign/Schema/Schema';
import { SchemaInstanceEntity } from '../SchemaInstance/SchemaInstanceEntity';
import { mapEntityToDomainObject } from './Mapping';
import { SchemaEntity } from './SchemaEntity';

export const findSchemasByCampaignId = async (campaignId: number): Promise<Schema[]> => {
  const repository = getRepository(SchemaEntity);
  const entities = await repository.find({ campaignId });
  return entities.map(mapEntityToDomainObject);
};

export const deleteSchemaById = async (id: number): Promise<void> => {
  await getRepository(SchemaEntity).delete({ id });
};

export const saveSchema = async (schema: Schema): Promise<Schema> => {
  const entity = await getRepository(SchemaEntity).save(schema);
  return mapEntityToDomainObject(entity);
};

export const findSchemaById = async (id: number): Promise<Schema | null> => {
  const entity = await getRepository(SchemaEntity).findOne({ id });
  return entity ? mapEntityToDomainObject(entity) : null;
};

export const countInstancesById = async (id: number): Promise<number> =>
  await getRepository(SchemaInstanceEntity).count({ where: { schemaId: id } });
