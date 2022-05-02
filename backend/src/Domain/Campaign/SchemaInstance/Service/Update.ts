import { ObjectUpdateDto } from '../../../../Application/Controller/ObjectController/Dto/ObjectUpdateDto';
import { ErrorWrapper } from '../../../../Common/Type/ErrorWrapper';
import { saveSchemaInstance } from '../../../../Infrastracture/Entity/SchemaInstance/SchemaInstanceRepository';
import { User } from '../../../User/User';
import { Schema } from '../../Schema/Schema';
import { SchemaInstance } from '../SchemaInstance';
import { validateObject } from './Validate';

export const updateObject = async (
  data: ObjectUpdateDto,
  object: SchemaInstance,
  schema: Schema,
  user: User
): Promise<void> => {
  const toUpdate = constructObject(data, object);
  await validateObject(toUpdate, schema, user);
  await saveSchemaInstance(toUpdate);
};

const constructObject = (
  { imageBase64, metadataArray, title }: ObjectUpdateDto,
  currentObject: SchemaInstance
): SchemaInstance => {
  const result: SchemaInstance = { ...currentObject };
  if (imageBase64 !== undefined) {
    result.image = imageBase64 ? Buffer.from(imageBase64, 'base64') : null;
  }
  if (title) {
    result.title = title;
  }
  if (metadataArray) {
    result.metadataArray = metadataArray;
  }
  return result;
};

export class UpdateObjectError extends ErrorWrapper {}
