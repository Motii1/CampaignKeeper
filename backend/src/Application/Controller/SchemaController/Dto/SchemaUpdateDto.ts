/**
 * @typedef SchemaUpdateDto
 * @property {string} title - title
 * @property {Array.<string>} fields - array of field names
 */

import * as Joi from 'joi';

export type SchemaUpdateDto = {
  title?: string;
  fields?: string[];
};

export const schemaUpdateDtoSchema = Joi.object<SchemaUpdateDto>({
  title: Joi.string().max(128),
  fields: Joi.array().items(Joi.string().max(32)).max(20),
});
