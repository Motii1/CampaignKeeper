/**
 * @typedef CampaignInsertDto
 * @property {string} name - name
 */

import * as Joi from 'joi';

export type CampaignInsertDto = {
  name: string;
};

export const campaignInsertDtoSchema = Joi.object<CampaignInsertDto>({
  name: Joi.string().max(128).required(),
});
