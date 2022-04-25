/**
 * @typedef ObjectUpdateDto
 * @property {string} title - title
 * @property {Array.<SingleFieldValueDto>} fields - array of field with values. Problems with swagger generation, the correct format should be like this: { ..., fields: [ ['Name', { type: 'string', value: 'xxx' }] ] }
 */

import * as Joi from 'joi';
import { FieldValue } from './FieldValue';

export type ObjectUpdateDto = {
  title?: string;
  fields?: FieldValue[];
};

// @todo
export const objectUpdateDtoSchema = Joi.object<ObjectUpdateDto>({});
