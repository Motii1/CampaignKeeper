/**
 * @typedef ObjectInsertDto
 * @property {string} title - title
 * @property {string} schemaId - id of schema
 * @property {Array.<SingleFieldValueDto>} fields - array of field with values. Problems with swagger generation, the correct format should be like this: { ..., fields: [ ['Name', { type: 'string', value: 'xxx' }] ] }
 */

import * as Joi from 'joi';
import { FieldValue } from './FieldValue';

export type ObjectInsertDto = {
  title: string;
  schemaId: number;
  fields: FieldValue[];
};

// @todo fix schema
export const objectInsertDtoSchema = Joi.object<ObjectInsertDto>({});
