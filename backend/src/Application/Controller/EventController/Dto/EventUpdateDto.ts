/**
 * @typedef EventUpdateDto
 * @property {string} title - title
 * @property {string} type - event type, can be 'normal' or 'fight'
 * @property {string} status - event status, can be: 'none', 'done', 'omitted'
 * @property {string} displayStatus - display status, can be: 'shown', 'hidden', 'collapsed'
 * @property {Array.<TextFieldMetadataDto>} placeMetadataArray - place textfield metadata representation
 * @property {Array.<TextFieldMetadataDto>} descriptionMetadataArray - description textfield metadata representation
 * @property {Array.<TextFieldMetadataDto>} charactersMetadataArray - characters textfield metadata representation
 * @property {Array.<number>} parentIds - array of parents IDs
 */

import * as Joi from 'joi';
import {
  EventDisplayStatus,
  EventStatus,
  EventType,
  TextFieldType,
} from '../../../../Domain/Campaign/Event/Event';
import { TextFieldMetadata } from './EventInsertDto';

export type EventUpdateDto = {
  title?: string;
  type?: EventType;
  status?: EventStatus;
  displayStatus?: EventDisplayStatus;
  placeMetadataArray?: TextFieldMetadata[];
  charactersMetadataArray?: TextFieldMetadata[];
  descriptionMetadataArray?: TextFieldMetadata[];
  parentIds?: number[];
};

export const textFieldMetadataDtoSchema = Joi.array().items({
  value: Joi.string().required().allow(''),
  sequenceNumber: Joi.number().min(0).required(),
  type: Joi.string()
    .valid(...Object.values(TextFieldType))
    .required(),
});

export const eventUpdateDtoSchema = Joi.object<EventUpdateDto>({
  title: Joi.string().max(128),
  status: Joi.string().valid(...Object.values(EventStatus)),
  type: Joi.string().valid(...Object.values(EventType)),
  placeMetadataArray: textFieldMetadataDtoSchema,
  descriptionMetadataArray: textFieldMetadataDtoSchema,
  charactersMetadataArray: textFieldMetadataDtoSchema,
  parentIds: Joi.array().items(Joi.number().positive()),
  displayStatus: Joi.string().valid(...Object.values(EventDisplayStatus)),
});
