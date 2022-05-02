import {
  SchemaInstance,
  SchemaInstanceMetadata,
} from '../../../Domain/Campaign/SchemaInstance/SchemaInstance';
import { SchemaInstanceEntity } from './SchemaInstanceEntity';
import { SchemaInstanceMetadataEntity } from './SchemaInstanceMetadataEntity';

export const mapEntityToDomainObject = (entity: SchemaInstanceEntity): SchemaInstance => ({
  id: entity.id,
  image: entity.image,
  schemaId: entity.schemaId,
  title: entity.title,
  metadataArray: entity.metadataArray.map(mapEntityMetadataToDomainObject),
});

export const mapEntityMetadataToDomainObject = (
  entity: SchemaInstanceMetadataEntity
): SchemaInstanceMetadata => ({
  id: entity.id,
  objectId: entity.objectId,
  sequenceNumber: entity.sequenceNumber,
  type: entity.type,
  value: entity.value,
  fieldName: entity.fieldName,
});
