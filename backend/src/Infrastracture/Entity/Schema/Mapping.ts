import { Schema } from '../../../Domain/Campaign/Schema/Schema';
import { SchemaEntity } from './SchemaEntity';

// @todo adjust whole file
export const mapEntityToDomainObject = (entity: SchemaEntity): Schema => ({ id: entity.id });
