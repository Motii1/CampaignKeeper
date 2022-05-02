import { Schema } from '../../../Domain/Campaign/Schema/Schema';
import { SchemaEntity } from './SchemaEntity';

export const mapEntityToDomainObject = (entity: SchemaEntity): Schema => ({
  id: entity.id,
  campaignId: entity.campaignId!,
  title: entity.title,
  fields: entity.fields,
});
