import { ObjectInsertDto } from '../../../../Application/Controller/ObjectController/Dto/ObjectInsertDto';
import { saveSchemaInstance } from '../../../../Infrastracture/Entity/SchemaInstance/SchemaInstanceRepository';
import { User } from '../../../User/User';
import { Schema } from '../../Schema/Schema';
import { SchemaInstance } from '../SchemaInstance';
import { validateObject } from './Validate';

export const createObject = async (
  { title, imageBase64, metadataArray }: ObjectInsertDto,
  schema: Schema,
  user: User
): Promise<SchemaInstance> => {
  const object: SchemaInstance = {
    title: title,
    schemaId: schema.id,
    image: imageBase64 ? Buffer.from(imageBase64, 'base64') : null,
    metadataArray: metadataArray.map(({ sequenceNumber, type, value, fieldName }) => ({
      sequenceNumber,
      type,
      value,
      fieldName,
    })),
  };

  await validateObject(object, schema, user);
  return await saveSchemaInstance(object);
};
