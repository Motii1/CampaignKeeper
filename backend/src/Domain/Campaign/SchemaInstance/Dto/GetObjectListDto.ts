import { FieldValueType } from '../FieldValueType';

export type GetObjectListDto = SingleGetObjectListDto[];

export type SingleGetObjectListDto = {
  id: number;
  title: string;
  schemaId: number;
  imageBase64: string | null;
  metadataArray: SingleGetObjectListMetadataDto[];
};

export type SingleGetObjectListMetadataDto = {
  type: FieldValueType;
  sequenceNumber: number;
  value: string;
  fieldName: string;
};
