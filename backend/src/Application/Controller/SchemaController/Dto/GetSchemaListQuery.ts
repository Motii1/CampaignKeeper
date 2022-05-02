/**
 * @typedef SingleGetSchemaListDto
 * @property {string} id - schema id
 * @property {string} title - schema title
 * @property {number} campaignId - id of campaign
 * @property {Array.<string>} fields - array of field names
 */
/**
 * @typedef GetSchemaListDto
 * @property {Array.<SingleGetSchemaListDto>} schemas - array of schemas dto data
 */

import * as Joi from 'joi';

export const getSchemaQuerySchema = Joi.object({
  campaignId: Joi.number().positive().required(),
});
