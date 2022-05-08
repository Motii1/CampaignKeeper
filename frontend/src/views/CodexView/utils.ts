import { EntriesHashMap, Entry, MetadataInstance } from './codexSlice';
import { EntryFieldState } from './dialog/CodexDialog';

export const convertFieldToMetadataArray = (
  field: EntryFieldState,
  fieldName: string
): MetadataInstance => ({
  type: 'string',
  sequenceNumber: 0,
  value: field.value,
  fieldName: fieldName,
});

export const getMetadataByFieldName = (
  fieldName: string,
  metadata: MetadataInstance[]
): MetadataInstance[] => metadata.filter(element => element.fieldName === fieldName);

const getEntryNameById = (id: string, entries: Entry[]): string => {
  const entry = entries.find(entry => entry.id === id);
  return entry ? entry.title : 'REFERENCE_NOT_FOUND';
};

export const convertEntriesHashMapToList = (entries: EntriesHashMap): Entry[] => {
  const entriesAsLists: Entry[] = [];
  Object.keys(entries).forEach(schemaId => entriesAsLists.concat(entries[schemaId]));
  return entriesAsLists;
};

export const getEditFieldFromMetadata = (
  fieldName: string,
  metadata: MetadataInstance[],
  entries: Entry[]
): EntryFieldState => {
  const fieldMetadata = getMetadataByFieldName(fieldName, metadata).sort((m1, m2) =>
    m1.sequenceNumber > m2.sequenceNumber ? 1 : m2.sequenceNumber > m1.sequenceNumber ? -1 : 0
  );
  const fieldString = fieldMetadata
    .map(metadata =>
      metadata.type === 'string' ? metadata.value : `|${getEntryNameById(metadata.value, entries)}|`
    )
    .join('');
  const fieldIds = fieldMetadata.map(metadata => metadata.value);
  return {
    value: fieldString,
    ids: fieldIds,
  };
};
