/**
 * @typedef NoteInsertDto
 * @property {string} value - string value of the note
 */

import * as Joi from 'joi';

export type NoteInsertDto = {
  value: string;
};

export const noteInsertDtoSchema = Joi.object<NoteInsertDto>({
  value: Joi.string().required(),
});
