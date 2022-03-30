/**
 * @typedef SingleGetSessionListDto
 * @property {string} id - session id
 * @property {string} name - session name
 * @property {string} createdAt - created date
 * @property {string} campaignId - campaign id
 */
/**
 * @typedef GetSessionListDto
 * @property {Array.<SingleGetSessionListDto>} sessions - array of sessions dto data
 */

import * as Joi from 'joi';

export const getSessionQuerySchema = Joi.object({
  campaignId: Joi.number().positive().required(),
});
