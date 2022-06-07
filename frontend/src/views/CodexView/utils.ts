import { EntriesHashMap, Entry, MetadataInstance, Schema } from './codexSlice';
import { EditFieldMetadata, EditFieldsState } from './dialog/CodexDialog';

export const convertEditFieldToMetadata = (
  fieldMetadata: EditFieldMetadata[],
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
  return metadata;
};

export const convertMetadataToEntryField = (
  fieldName: string,
  metadata: MetadataInstance[],
  entries: Entry[]
): EditFieldMetadata[] => {
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
  oldEditField: EditFieldMetadata[],
  fieldValue: string
): EditFieldMetadata[] => {
  const newEditField: EditFieldMetadata[] = [];
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

export const convertEditFieldToString = (editField: EditFieldMetadata[]): string =>
  editField.map(field => (field.id ? `|${field.value}|` : field.value)).join('');

export const createEmptyFields = (schema: null | Schema): EditFieldsState => {
  const currentFields: EditFieldsState = {};
  schema?.fields.forEach(field => {
    currentFields[field] = [];
  });
  return currentFields;
};

export const createFilledFields = (
  schema: null | Schema,
  entry: Entry | null,
  entries: EntriesHashMap
): EditFieldsState => {
  const currentFields: EditFieldsState = {};
  const entriesAsList: Entry[] = convertEntriesHashMapToList(entries);
  if (entry)
    schema?.fields.forEach(
      fieldName =>
        (currentFields[fieldName] = convertMetadataToEntryField(
          fieldName,
          entry.metadataArray,
          entriesAsList
        ))
    );
  return currentFields;
};
