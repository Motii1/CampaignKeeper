/**
 * @typedef NoteUpdateDto
 * @property {string} value - string value of the note
 */

import * as Joi from 'joi';

export type NoteUpdateDto = {
  value: string;
};

export const noteUpdateDtoSchema = Joi.object<NoteUpdateDto>({
  value: Joi.string().required(),
});
