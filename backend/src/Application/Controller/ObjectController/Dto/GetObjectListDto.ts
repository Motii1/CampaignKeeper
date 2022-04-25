/**
 * @typedef SingleGetObjectListDto
 * @property {string} id - object id
 * @property {string} title - object title
 * @property {Array.<SingleFieldValueDto>} fields - array of field values dto. Problems with swagger generation, the correct format should be like this: { ..., fields: [ ['Name', { type: 'string', value: 'xxx' }] ] }
 */
/**
 * @typedef GetObjectListDto
 * @property {Array.<SingleGetObjectListDto>} objects - array of objects dto data
 */

import * as Joi from 'joi';

export const getObjectQuerySchema = Joi.object({
  schemaId: Joi.number().positive().required(),
});
