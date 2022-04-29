/**
 * @typedef SingleGetSchemaListDto
 * @property {string} id - schema id
 * @property {string} title - schema title
 * @property {Array.<string>} fields - array of field names
 * @property {boolean} deletable - deletable indication
 */
/**
 * @typedef GetSchemaListDto
 * @property {Array.<SingleGetSchemaListDto>} schemas - array of schemas dto data
 */

import * as Joi from 'joi';

export const getSchemaQuerySchema = Joi.object({
  campaignId: Joi.number().positive().required(),
});
