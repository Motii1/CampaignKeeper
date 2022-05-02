import { FieldValueType } from './FieldValueType';

export type SchemaInstance = {
  id?: number;
  schemaId?: number;
  title: string;
  image: Buffer | null;
  metadataArray: SchemaInstanceMetadata[];
};

export type SchemaInstanceMetadata = {
  id?: number;
  objectId?: number;
  type: FieldValueType;
  value: string;
  sequenceNumber: number;
  fieldName: string;
};
