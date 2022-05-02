import { saveSchema } from '../../../Infrastracture/Entity/Schema/SchemaRepository';
import { saveSchemaInstance } from '../../../Infrastracture/Entity/SchemaInstance/SchemaInstanceRepository';
import { FieldValueType } from '../SchemaInstance/FieldValueType';
import { SchemaInstance } from '../SchemaInstance/SchemaInstance';
import { Schema } from './Schema';

export const insertDefaultSchemasWithData = async (campaignId: number): Promise<void> => {
  const schemasWithObject = getDefaultSchemasWithObject(campaignId);
  await Promise.all(schemasWithObject.map(saveSchemaWithDefaultObject));
};

const getDefaultSchemasWithObject = (campaignId: number): [Schema, SchemaInstance][] => {
  const NPC_DEFAULT_SCHEMA: Schema = {
    title: 'NPC',
    campaignId,
    fields: ['Name', 'Surname', 'Age', 'Occupation', 'Description', 'Character'],
  };
  const NPC_DEFAULT_OBJECT: SchemaInstance = {
    title: 'Sample NPC',
    image: null,
    metadataArray: [
      { fieldName: 'Name', sequenceNumber: 0, type: FieldValueType.string, value: 'George' },
      { fieldName: 'Surname', sequenceNumber: 0, type: FieldValueType.string, value: 'Stefano' },
      { fieldName: 'Age', sequenceNumber: 0, type: FieldValueType.string, value: '32' },
      {
        fieldName: 'Occupation',
        sequenceNumber: 0,
        type: FieldValueType.string,
        value: 'Italian cook',
      },
      {
        fieldName: 'Description',
        sequenceNumber: 0,
        type: FieldValueType.string,
        value: 'Regular cook without any hidden connections',
      },
      {
        fieldName: 'Character',
        sequenceNumber: 0,
        type: FieldValueType.string,
        value: 'Quiet and polite person',
      },
    ],
  };

  const CITY_DEFAULT_SCHEMA: Schema = {
    title: 'City',
    campaignId,
    fields: ['Location', 'Country', 'Population', 'Ruler', 'Points of interest'],
  };
  const CITY_DEFAULT_OBJECT: SchemaInstance = {
    image: null,
    title: 'Sample city',
    metadataArray: [
      {
        fieldName: 'Location',
        sequenceNumber: 0,
        type: FieldValueType.string,
        value: 'Sample location',
      },
      {
        fieldName: 'Country',
        sequenceNumber: 0,
        type: FieldValueType.string,
        value: 'Sample county',
      },
      {
        fieldName: 'Population',
        sequenceNumber: 0,
        type: FieldValueType.string,
        value: 'Sample population',
      },
      {
        fieldName: 'Ruler',
        sequenceNumber: 0,
        type: FieldValueType.string,
        value: 'Sample powerful ruler',
      },
      {
        fieldName: 'Points of interest',
        sequenceNumber: 0,
        type: FieldValueType.string,
        value: 'Some sample points of interest',
      },
    ],
  };

  return [
    [NPC_DEFAULT_SCHEMA, NPC_DEFAULT_OBJECT],
    [CITY_DEFAULT_SCHEMA, CITY_DEFAULT_OBJECT],
  ];
};

const saveSchemaWithDefaultObject = async ([schema, object]: [
  Schema,
  SchemaInstance
]): Promise<void> => {
  const savedSchema = await saveSchema(schema);
  await saveSchemaInstance({ ...object, schemaId: savedSchema.id });
};
