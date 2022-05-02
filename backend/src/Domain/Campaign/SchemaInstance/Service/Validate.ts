import { ErrorWrapper } from '../../../../Common/Type/ErrorWrapper';
import { findUserCampaignById } from '../../../../Infrastracture/Entity/Campaign/CampaignRepository';
import { findSchemaById } from '../../../../Infrastracture/Entity/Schema/SchemaRepository';
import { findSchemaInstanceById } from '../../../../Infrastracture/Entity/SchemaInstance/SchemaInstanceRepository';
import { User } from '../../../User/User';
import { Schema } from '../../Schema/Schema';
import { FieldValueType } from '../FieldValueType';
import { SchemaInstance } from '../SchemaInstance';

export const validateObject = async (
  object: SchemaInstance,
  schema: Schema,
  user: User
): Promise<void> => {
  validateFieldNames(object, schema);
  await validateIds(object, user);
};

const validateFieldNames = (object: SchemaInstance, { fields }: Schema): void => {
  const fieldNames = [...new Set(object.metadataArray.map(item => item.fieldName))];
  const fieldsPresence = fields.every(item => fieldNames.includes(item));
  if (!fieldsPresence || fieldNames.length !== fields.length) {
    throw new SchemaValidationError(
      'Field names from the object are different than fields defined in the schema'
    );
  }
};

const validateIds = async (object: SchemaInstance, user: User): Promise<void> => {
  const possiblyDuplicatedIds = object.metadataArray.reduce<number[]>((acc, { type, value }) => {
    if (type !== FieldValueType.id) {
      return acc;
    }
    const id = Number(value);
    if (isNaN(id) || id <= 0) {
      throw new SchemaValidationError(`One of IDs is not a number: ${value}`);
    }
    return [...acc, id];
  }, []);
  const uniqueIds = [...new Set(possiblyDuplicatedIds)];
  await Promise.all(uniqueIds.map(id => validateSingleId(id, user)));
};

const validateSingleId = async (id: number, user: User): Promise<void> => {
  const object = await findSchemaInstanceById(id);
  if (!object) {
    throwObjectDoesNotExist(id);
  }
  const schema = await findSchemaById(object!.schemaId!);
  if (!schema) {
    throwObjectDoesNotExist(id);
  }
  const campaign = await findUserCampaignById(schema!.campaignId, user);
  if (!campaign) {
    throwObjectDoesNotExist(id);
  }
};

const throwObjectDoesNotExist = (id: number): never => {
  throw new SchemaValidationError(`Object with id ${id} does not exist`);
};

export class SchemaValidationError extends ErrorWrapper {}
