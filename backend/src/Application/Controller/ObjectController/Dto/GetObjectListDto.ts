/**
 * @typedef SingleObjectMetadataDto
 * @property {string} type - type of field value, can be 'string' or 'id'
 * @property {number} sequenceNumber - sequence number
 * @property {string} value - value provided as string type no matter if it is id or not
 * @property {string} fieldName - name of the field
 */
/**
 * @typedef SingleGetObjectListDto
 * @property {string} id - object id
 * @property {string} title - object title
 * @property {number} schemaId - id of schema
 * @property {string} imageBase64 - base64 representation of the image
 * @property {Array.<SingleObjectMetadataDto>} metadataArray - array of field values dto
 */
/**
 * @typedef GetObjectListDto
 * @property {Array.<SingleGetObjectListDto>} objects - array of objects dto data
 */

import * as Joi from 'joi';

export const getObjectQuerySchema = Joi.object({
  schemaId: Joi.number().positive().required(),
});
