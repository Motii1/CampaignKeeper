/**
 * @typedef TextFieldMetadataDto
 * @property {string} value - value as string type
 * @property {number} sequenceNumber - sequence number
 * @property {number} type - type of metadata, can be 'id' or 'string'
 */
/**
 * @typedef EventInsertDto
 * @property {string} title - title
 * @property {number} sessionId - id of session
 * @property {string} type - event type, can be 'normal' or 'fight'
 * @property {string} status - event status, can be: 'none', 'done', 'omitted'
 * @property {Array.<TextFieldMetadataDto>} placeMetadataArray - place textfield metadata representation
 * @property {Array.<TextFieldMetadataDto>} descriptionMetadataArray - description textfield metadata representation
 * @property {Array.<TextFieldMetadataDto>} charactersMetadataArray - characters textfield metadata representation
 * @property {Array.<number>} parentIds - array of parents IDs
 */

import * as Joi from 'joi';
import { EventStatus, EventType, TextFieldType } from '../../../../Domain/Campaign/Event/Event';

export type EventInsertDto = {
  title: string;
  sessionId: number;
  type: EventType;
  status: EventStatus;
  placeMetadataArray: TextFieldMetadata[];
  charactersMetadataArray: TextFieldMetadata[];
  descriptionMetadataArray: TextFieldMetadata[];
  parentIds: number[];
};

export type TextFieldMetadata = {
  value: string;
  sequenceNumber: number;
  type: TextFieldType;
};

export const textFieldMetadataDtoSchema = Joi.array().items({
  value: Joi.string().required().allow(''),
  sequenceNumber: Joi.number().min(0).required(),
  type: Joi.string()
    .valid(...Object.values(TextFieldType))
    .required(),
});

export const eventInsertDtoSchema = Joi.object<EventInsertDto>({
  title: Joi.string().required().max(128),
  sessionId: Joi.number().positive().required(),
  status: Joi.string()
    .valid(...Object.values(EventStatus))
    .required(),
  type: Joi.string()
    .valid(...Object.values(EventType))
    .required(),
  placeMetadataArray: textFieldMetadataDtoSchema.required(),
  descriptionMetadataArray: textFieldMetadataDtoSchema.required(),
  charactersMetadataArray: textFieldMetadataDtoSchema.required(),
  parentIds: Joi.array().items(Joi.number().positive()).required(),
});
