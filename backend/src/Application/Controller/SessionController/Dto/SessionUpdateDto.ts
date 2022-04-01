/**
 * @typedef SessionUpdateDto
 * @property {string} name - session name
 */

import * as Joi from 'joi';

export type SessionUpdateDto = {
  name: string;
};

export const sessionUpdateDtoSchema = Joi.object<SessionUpdateDto>({
  name: Joi.string().max(128).required(),
});
