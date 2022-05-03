import { getRepository } from 'typeorm';
import { FieldValueType } from '../../../Domain/Campaign/SchemaInstance/FieldValueType';
import { SchemaInstance } from '../../../Domain/Campaign/SchemaInstance/SchemaInstance';
import { mapEntityToDomainObject } from './Mapping';
import { SchemaInstanceEntity } from './SchemaInstanceEntity';
import { SchemaInstanceMetadataEntity } from './SchemaInstanceMetadataEntity';

export const findSchemaInstancesBySchemaId = async (
  schemaId: number
): Promise<SchemaInstance[]> => {
  const repo = getRepository(SchemaInstanceEntity);
  const entities = await repo.find({ schemaId });
  return entities.map(mapEntityToDomainObject);
};

export const findSchemaInstanceById = async (id: number): Promise<SchemaInstance | null> => {
  const repo = await getRepository(SchemaInstanceEntity);
  const entity = await repo.findOne({ id });
  return entity ? mapEntityToDomainObject(entity) : null;
};

export const saveSchemaInstance = async (
  schemaInstance: SchemaInstance
): Promise<SchemaInstance> => {
  const repo = getRepository(SchemaInstanceEntity);
  if (!schemaInstance.id) {
    const entity = await repo.save(schemaInstance);
    return mapEntityToDomainObject(entity);
  }
  const existing = await repo.findOne(schemaInstance.id);
  if (!existing) {
    throw new Error(`Cannot update object with id ${schemaInstance.id}`);
  }
  const metadataRepo = getRepository(SchemaInstanceMetadataEntity);
  await metadataRepo.delete({ objectId: existing.id });
  const entity = await repo.save(schemaInstance);
  return mapEntityToDomainObject(entity);
};

export const deleteSchemaInstanceById = async (id: number): Promise<void> => {
  await getRepository(SchemaInstanceEntity).delete({ id });
};

export const countReferencesById = async (id: number): Promise<number> =>
  await getRepository(SchemaInstanceMetadataEntity).count({
    where: { type: FieldValueType.id, value: '' + id },
  });
