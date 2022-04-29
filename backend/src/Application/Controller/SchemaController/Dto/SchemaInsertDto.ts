/**
 * @typedef SchemaInsertDto
 * @property {string} title - title
 * @property {string} campaignId - id of campaign
 * @property {Array.<string>} fields - array of fields names
 */

import * as Joi from 'joi';

export type SchemaInsertDto = {
  title: string;
  campaignId: number;
  fields: string[];
};

export const schemaInsertDtoSchema = Joi.object<SchemaInsertDto>({
  title: Joi.string().max(128).required(),
  campaignId: Joi.number().positive().required(),
  fields: Joi.array().items(Joi.string().max(32)).max(20).required(),
});
