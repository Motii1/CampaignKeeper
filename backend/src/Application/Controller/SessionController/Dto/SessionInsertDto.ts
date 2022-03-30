/**
 * @typedef SessionInsertDto
 * @property {string} name - name
 * @property {string} campaignId - id of campaign
 */

import * as Joi from 'joi';

export type SessionInsertDto = {
  name: string;
  campaignId: number;
};

export const sessionInsertDtoSchema = Joi.object<SessionInsertDto>({
  name: Joi.string().max(64).required(),
  campaignId: Joi.number().positive().required(),
});
