import { EntriesHashMap, Entry, MetadataInstance } from './codexSlice';
import { EntryFieldMetadata } from './dialog/CodexDialog';

export const convertEditFieldToMetadata = (
  fieldMetadata: EntryFieldMetadata[],
  fieldName: string
): MetadataInstance[] => {
  let index = 0;
  const metadata: MetadataInstance[] = [];
  fieldMetadata.forEach(field => {
    if (field.value !== '')
      if (field.id)
        metadata.push({
          type: 'id',
          sequenceNumber: index,
          value: `${field.id}`,
          fieldName: fieldName,
        });
      else
        metadata.push({
          type: 'string',
          sequenceNumber: index,
          value: field.value,
          fieldName: fieldName,
        });
    index += 1;
  });
  // eslint-disable-next-line no-console
  console.log(metadata);
  return metadata;
};

export const convertMetadataToEntryField = (
  fieldName: string,
  metadata: MetadataInstance[],
  entries: Entry[]
): EntryFieldMetadata[] => {
  const fieldMetadata = getMetadataByFieldName(fieldName, metadata).sort((m1, m2) =>
    m1.sequenceNumber > m2.sequenceNumber ? 1 : m2.sequenceNumber > m1.sequenceNumber ? -1 : 0
  );
  return fieldMetadata.map(metadata => ({
    value:
      metadata.type === 'string' ? metadata.value : `${getEntryNameById(metadata.value, entries)}`,
    id: metadata.type === 'id' ? metadata.value : null,
  }));
};

export const getEntryFromMetadata = (
  metadata: MetadataInstance,
  entries: Entry[]
): Entry | null => {
  const entry = entries.find(entry => `${entry.id}` === metadata.value);
  return entry ? entry : null;
};

export const getMetadataByFieldName = (
  fieldName: string,
  metadata: MetadataInstance[]
): MetadataInstance[] => metadata.filter(element => element.fieldName === fieldName);

const getEntryNameById = (id: string, entries: Entry[]): string => {
  const entry = entries.find(entry => `${entry.id}` === id);
  return entry ? entry.title : 'REFERENCE_NOT_FOUND';
};

export const convertEntriesHashMapToList = (entries: EntriesHashMap): Entry[] => {
  let entriesAsLists: Entry[] = [];
  Object.keys(entries).forEach(schemaId => {
    entriesAsLists = entriesAsLists.concat(entries[schemaId]);
  });
  return entriesAsLists;
};

export const getUpdatedEditField = (
  oldEditField: EntryFieldMetadata[],
  fieldValue: string
): EntryFieldMetadata[] => {
  const newEditField: EntryFieldMetadata[] = [];
  const newValues = fieldValue.split('|');
  newValues.forEach(value => {
    if (value !== '') {
      const existingMetadata = oldEditField.find(element => element.value === value);
      if (existingMetadata) newEditField.push(existingMetadata);
      else
        newEditField.push({
          value: value,
          id: null,
        });
    }
  });
  return newEditField;
};

export const convertEditFieldToString = (editField: EntryFieldMetadata[]): string =>
  editField.map(field => (field.id ? `|${field.value}|` : field.value)).join('');
