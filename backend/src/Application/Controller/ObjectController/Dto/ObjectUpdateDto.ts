/**
 * @typedef ObjectUpdateDto
 * @property {string} title - title
 * @property {string} imageBase64 - base64 representation of the image
 * @property {Array.<ObjectMetadataDto>} metadataArray - array of field with values
 */

import * as Joi from 'joi';
import { FieldValueType } from '../../../../Domain/Campaign/SchemaInstance/FieldValueType';
import { MAX_CAMPAIGN_BASE64_STRING_LENGTH } from './Const';
import { ObjectInsertMetadata } from './ObjectInsertDto';

export type ObjectUpdateDto = {
  title?: string;
  imageBase64?: string | null;
  metadataArray?: ObjectInsertMetadata[];
};

export const objectUpdateDtoSchema = Joi.object<ObjectUpdateDto>({
  title: Joi.string().max(128),
  imageBase64: Joi.string().allow(null).max(MAX_CAMPAIGN_BASE64_STRING_LENGTH),
  metadataArray: Joi.array().items({
    type: Joi.string()
      .valid(...Object.values(FieldValueType))
      .required(),
    value: Joi.string().required(),
    sequenceNumber: Joi.number().min(0).required(),
    fieldName: Joi.string().required(),
  }),
});
