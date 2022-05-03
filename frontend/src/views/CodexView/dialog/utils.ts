import { MetadataInstance } from '../codexViewSlice';

export const convertStringToMetadataArray = (
  text: string,
  fieldName: string
): MetadataInstance => ({
  type: 'string',
  sequenceNumber: 0,
  value: text,
  fieldName: fieldName,
});
