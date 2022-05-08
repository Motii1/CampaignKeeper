import { EntriesHashMap, Entry, MetadataInstance } from './codexSlice';
import { EntryFieldState } from './dialog/CodexDialog';

export const convertEditFieldToMetadata = (
  field: EntryFieldState,
  fieldName: string
): MetadataInstance[] => {
  const values = field.value.split('|');
  const { ids } = field;
  let isEven = true;
  let index = 0;
  const metadata: MetadataInstance[] = [];
  values.forEach(value => {
    if (value === '') isEven = !isEven;
    else {
      if (isEven)
        metadata.push({
          type: 'string',
          sequenceNumber: index,
          value: value,
          fieldName: fieldName,
        });
      else {
        const id = ids.shift();
        if (id)
          metadata.push({
            type: 'id',
            sequenceNumber: index,
            value: `${id}`,
            fieldName: fieldName,
          });
      }
      index += 1;
      isEven = !isEven;
    }
  });
  // eslint-disable-next-line no-console
  console.log(metadata);
  return metadata;
};

export const getMetadataByFieldName = (
  fieldName: string,
  metadata: MetadataInstance[]
): MetadataInstance[] => metadata.filter(element => element.fieldName === fieldName);

const getEntryNameById = (id: string, entries: Entry[]): string => {
  const entry = entries.find(entry => entry.id === id);
  return entry ? entry.title : 'REFERENCE_NOT_FOUND';
};

export const convertEntriesHashMapToList = (entries: EntriesHashMap): Entry[] => {
  let entriesAsLists: Entry[] = [];
  Object.keys(entries).forEach(schemaId => {
    entriesAsLists = entriesAsLists.concat(entries[schemaId]);
  });
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

export const getEntryFromMetadata = (
  metadata: MetadataInstance,
  entries: Entry[]
): Entry | null => {
  const entry = entries.find(entry => `${entry.id}` === metadata.value);
  return entry ? entry : null;
};
