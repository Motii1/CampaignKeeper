import { ReferenceFieldMetadata, ReferenceFieldsState } from '../types/types';
import {
  CodexMetadataInstance,
  EntriesHashMap,
  Entry,
  Schema,
} from '../views/CodexView/codexSlice';
import {
  EventFieldMetadata,
  SessionEvent,
  SessionEventWithPos,
} from '../views/MapView/eventsSlice';

/**
 * Used to convert files into base64
 * @param file
 * @returns
 */
export const toBase64 = (file: File): Promise<null | string | ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

/**
 * Used to convert images (files) into base64 encoding
 * while removing part of base64 string which contains info about file type
 * @param file
 * @returns
 */
export const convertImageToBase64 = async (file: File): Promise<string> => {
  const imageAsBase64 = (await toBase64(file)) as string;
  return imageAsBase64.split(',')[1];
};

/**
 * Used to convert metadata from ReferenceField to metadata from Codex,
 * which allows using them in query
 * @param fieldMetadata
 * @param fieldName
 * @returns
 */
export const convertReferenceFieldToCodexMetadata = (
  fieldMetadata: ReferenceFieldMetadata[],
  fieldName: string
): CodexMetadataInstance[] => {
  let index = 0;
  const metadata: CodexMetadataInstance[] = [];
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

/**
 * Used to convert metadata from ReferenceField to metadata from Event,
 * which allows using them in query
 * @param fieldMetadata
 * @returns
 */
export const convertReferenceFieldToEventMetadata = (
  fieldMetadata: ReferenceFieldMetadata[]
): EventFieldMetadata[] => {
  let index = 0;
  const metadata: EventFieldMetadata[] = [];
  fieldMetadata.forEach(field => {
    if (field.value !== '')
      if (field.id)
        metadata.push({
          type: 'id',
          sequenceNumber: index,
          value: `${field.id}`,
        });
      else
        metadata.push({
          type: 'string',
          sequenceNumber: index,
          value: field.value,
        });
    index += 1;
  });
  return metadata;
};

const convertMetadataToEntryField = (
  fieldName: string,
  metadata: CodexMetadataInstance[],
  entries: Entry[]
): ReferenceFieldMetadata[] => {
  const fieldMetadata = getCodexMetadataByFieldName(fieldName, metadata).sort((m1, m2) =>
    m1.sequenceNumber > m2.sequenceNumber ? 1 : m2.sequenceNumber > m1.sequenceNumber ? -1 : 0
  );
  return fieldMetadata.map(metadata => ({
    value:
      metadata.type === 'string' ? metadata.value : `${getEntryNameById(metadata.value, entries)}`,
    id: metadata.type === 'id' ? metadata.value : null,
  }));
};

const convertMetadataToEventField = (
  metadata: EventFieldMetadata[],
  entries: Entry[]
): ReferenceFieldMetadata[] => {
  const fieldMetadata = [...metadata];
  fieldMetadata.sort((m1, m2) =>
    m1.sequenceNumber > m2.sequenceNumber ? 1 : m2.sequenceNumber > m1.sequenceNumber ? -1 : 0
  );
  return fieldMetadata.map(metadata => ({
    value:
      metadata.type === 'string' ? metadata.value : `${getEntryNameById(metadata.value, entries)}`,
    id: metadata.type === 'id' ? metadata.value : null,
  }));
};

/**
 * Used to find entery referenced in Codex metadata in Codex entries list
 * @param metadata
 * @param entries
 * @returns
 */
export const getEntryFromMetadata = (
  metadata: CodexMetadataInstance,
  entries: Entry[]
): Entry | null => {
  const entry = entries.find(entry => `${entry.id}` === metadata.value);
  return entry ? entry : null;
};

/**
 * Used to find all metadata related to provided field (by its name)
 * @param fieldName
 * @param metadata
 * @returns
 */
export const getCodexMetadataByFieldName = (
  fieldName: string,
  metadata: CodexMetadataInstance[]
): CodexMetadataInstance[] => metadata.filter(element => element.fieldName === fieldName);

/**
 * Used to find name of entry from Codex by its id
 * @param id
 * @param entries
 * @returns
 */
const getEntryNameById = (id: string, entries: Entry[]): string => {
  const entry = entries.find(entry => `${entry.id}` === id);
  return entry ? entry.title : 'REFERENCE_NOT_FOUND';
};

/**
 * Used to convert entries from hash map (as they stored in codex) to list
 * (in which form they are more accessible for multiple operations)
 * @param entries
 * @returns
 */
export const convertEntriesHashMapToList = (entries: EntriesHashMap): Entry[] => {
  let entriesAsLists: Entry[] = [];
  Object.keys(entries).forEach(schemaId => {
    entriesAsLists = entriesAsLists.concat(entries[schemaId]);
  });
  return entriesAsLists;
};

/**
 * Used to update metadata of ReferenceField after user input
 * @param oldEditField
 * @param fieldValue
 * @returns
 */
export const getUpdatedReferenceField = (
  oldEditField: ReferenceFieldMetadata[],
  fieldValue: string
): ReferenceFieldMetadata[] => {
  const newEditField: ReferenceFieldMetadata[] = [];
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

/**
 * Used to convert metadata of ReferenceField to displayable string
 * which can be shown in an input field
 * @param editField
 * @returns
 */
export const convertReferenceFieldToString = (editField: ReferenceFieldMetadata[]): string =>
  editField.map(field => (field.id ? `|${field.value}|` : field.value)).join('');

/**
 * Used to create state of CodexDialog form with all fields empty
 * @param schema
 * @returns
 */
export const createEmptyCodexFields = (schema: null | Schema): ReferenceFieldsState => {
  const currentFields: ReferenceFieldsState = {};
  schema?.fields.forEach(field => {
    currentFields[field] = [];
  });
  return currentFields;
};

/**
 * Used to create state of EventDialog form with all fields empty
 * @param fieldNames
 * @returns
 */
export const createEmptyEventFields = (fieldNames: string[]): ReferenceFieldsState => {
  const currentFields: ReferenceFieldsState = {};
  fieldNames.forEach(field => {
    currentFields[field] = [];
  });
  return currentFields;
};

/**
 * Used to create state of CodexDialog form with all fields filled
 * with data from store (from existing entry which CodexDialogs opens for edition)
 * @param schema
 * @returns
 */
export const createFilledCodexFields = (
  schema: null | Schema,
  entry: Entry | null,
  entries: EntriesHashMap
): ReferenceFieldsState => {
  const currentFields: ReferenceFieldsState = {};
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

/**
 * Used to create state of EventDialog form with all fields filled
 * with data from store (from existing event which EventDialog opens for edition)
 * @param fieldNames
 * @param event
 * @param entries
 * @returns
 */
export const createFilledEventFields = (
  fieldNames: string[],
  event: SessionEvent,
  entries: EntriesHashMap
): ReferenceFieldsState => {
  const currentFields: ReferenceFieldsState = {};
  const entriesAsList: Entry[] = convertEntriesHashMapToList(entries);

  currentFields[fieldNames[0]] = convertMetadataToEventField(
    event.placeMetadataArray,
    entriesAsList
  );
  currentFields[fieldNames[1]] = convertMetadataToEventField(
    event.charactersMetadataArray,
    entriesAsList
  );
  currentFields[fieldNames[2]] = convertMetadataToEventField(
    event.descriptionMetadataArray,
    entriesAsList
  );

  return currentFields;
};

/**
 * Used to compare events by their title (alphabetically ASC)
 * @param e1
 * @param e2
 * @returns
 */
export const compareEventsByTitle = (e1: SessionEventWithPos, e2: SessionEventWithPos): number => {
  if (e1.title < e2.title) return -1;
  if (e1.title > e2.title) return 1;
  return 0;
};

/**
 * Used to compare events by their horizontal (x) position in EventGraph (ASC)
 * @param e1
 * @param e2
 * @returns
 */
export const compareEventsByX = (e1: SessionEventWithPos, e2: SessionEventWithPos): number => {
  if (e1.x < e2.x) return -1;
  if (e1.x > e2.x) return 1;
  return 0;
};

/**
 * Used to compare events by their horizontal (x) position in EventGraph (ASC)
 * and if position is equal by their id (ASC)
 * @param e1
 * @param e2
 * @returns
 */
export const compareEventsByXThenId = (
  e1: SessionEventWithPos,
  e2: SessionEventWithPos
): number => {
  if (e1.x < e2.x) return -1;
  if (e1.x > e2.x) return 1;
  if (e1.id > e2.id) return 1;
  if (e1.id < e2.id) return -1;
  return 0;
};
