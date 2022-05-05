import { MetadataInstance } from '../codexViewSlice';

export const convertFieldToMetadataArray = (text: string, fieldName: string): MetadataInstance => ({
  type: 'string',
  sequenceNumber: 0,
  value: text,
  fieldName: fieldName,
});

export const getMetadataByFieldName = (
  fieldName: string,
  metadata: MetadataInstance[]
): MetadataInstance[] => metadata.filter(element => element.fieldName === fieldName);

export const getValueFromMetadataByFieldName = (
  fieldName: string,
  metadata: MetadataInstance[] | undefined
): string =>
  metadata
    ? getMetadataByFieldName(fieldName, metadata)
        .map(element => element.value)
        .join(' ')
    : '';
