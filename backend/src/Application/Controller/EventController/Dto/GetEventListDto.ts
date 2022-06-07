/**
 * @typedef SingleGetEventListDto
 * @property {number} id - id of the event
 * @property {string} title - title
 * @property {number} sessionId - id of session
 * @property {string} type - event type, can be 'normal' or 'fight'
 * @property {string} status - event status, can be: 'none', 'done', 'omitted'
 * @property {Array.<TextFieldMetadataDto>} placeMetadataArray - place textfield metadata representation
 * @property {Array.<TextFieldMetadataDto>} descriptionMetadataArray - description textfield metadata representation
 * @property {Array.<TextFieldMetadataDto>} charactersMetadataArray - characters textfield metadata representation
 * @property {Array.<number>} parentIds - array of parents IDs
 * @property {Array.<number>} childrenIds - array of children IDs
 */
/**
 * @typedef GetEventListDto
 * @property {Array.<SingleGetEventListDto>} events - array of events dto data
 */

import { EventStatus, EventType } from '../../../../Domain/Campaign/Event/Event';
import { TextFieldMetadata } from './EventInsertDto';

export type SingleGetEventListDto = {
  id: number;
  title: string;
  sessionId: number;
  type: EventType;
  status: EventStatus;
  placeMetadataArray: TextFieldMetadata[];
  charactersMetadataArray: TextFieldMetadata[];
  descriptionMetadataArray: TextFieldMetadata[];
  parentIds: number[];
  childrenIds: number[];
};
