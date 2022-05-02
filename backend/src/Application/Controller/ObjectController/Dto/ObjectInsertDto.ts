/**
 * @typedef ObjectMetadataDto
 * @property {string} type - type, can be 'string' or 'id'
 * @property {string} value - value as string type
 * @property {number} sequenceNumber - sequence number
 * @property {string} fieldName - name of the field that is used
 */
/**
 * @typedef ObjectInsertDto
 * @property {string} title - title
 * @property {string} schemaId - id of schema
 * @property {string} imageBase64 - base64 representation of the image or null
 * @property {Array.<ObjectMetadataDto>} metadataArray - array of field with values
 */

import * as Joi from 'joi';
import { FieldValueType } from '../../../../Domain/Campaign/SchemaInstance/FieldValueType';
import { MAX_CAMPAIGN_BASE64_STRING_LENGTH } from './Const';

export type ObjectInsertDto = {
  title: string;
  schemaId: number;
  imageBase64: string;
  metadataArray: ObjectInsertMetadata[];
};

export type ObjectInsertMetadata = {
  type: FieldValueType;
  value: string;
  sequenceNumber: number;
  fieldName: string;
};

export const objectInsertDtoSchema = Joi.object<ObjectInsertDto>({
  title: Joi.string().required().max(128),
  schemaId: Joi.number().positive().required(),
  imageBase64: Joi.string().allow(null).required().max(MAX_CAMPAIGN_BASE64_STRING_LENGTH),
  metadataArray: Joi.array()
    .required()
    .items({
      type: Joi.string()
        .valid(...Object.values(FieldValueType))
        .required(),
      value: Joi.string().required(),
      sequenceNumber: Joi.number().min(0).required(),
      fieldName: Joi.string().required(),
    }),
});
