/**
 * @typedef EventUpdateDto
 * @property {string} title - title
 * @property {string} type - event type, can be 'normal' or 'fight'
 * @property {string} status - event status, can be: 'none', 'done', 'omitted'
 * @property {Array.<TextFieldMetadataDto>} placeMetadataArray - place textfield metadata representation
 * @property {Array.<TextFieldMetadataDto>} descriptionMetadataArray - description textfield metadata representation
 * @property {Array.<TextFieldMetadataDto>} charactersMetadataArray - characters textfield metadata representation
 * @property {Array.<number>} parentIds - array of parents IDs
 */

import * as Joi from 'joi';
import { EventStatus, EventType } from '../../../../Domain/Campaign/Event/Event';
import { TextFieldMetadata } from './EventInsertDto';

export type EventUpdateDto = {
  title: string;
  type: EventType;
  status: EventStatus;
  placeMetadataArray: TextFieldMetadata[];
  charactersMetadataArray: TextFieldMetadata[];
  descriptionMetadataArray: TextFieldMetadata[];
  parentIds: number[];
};

export const textFieldMetadataDtoSchema = Joi.array().items({
  value: Joi.string().required(),
  sequenceNumber: Joi.number().min(0).required(),
});

export const eventUpdateDtoSchema = Joi.object<EventUpdateDto>({
  title: Joi.string().max(128),
  status: Joi.string().valid(...Object.values(EventStatus)),
  type: Joi.string().valid(...Object.values(EventType)),
  placeMetadataArray: textFieldMetadataDtoSchema,
  descriptionMetadataArray: textFieldMetadataDtoSchema,
  charactersMetadataArray: textFieldMetadataDtoSchema,
  parentIds: Joi.array().items(Joi.number().positive()),
});
