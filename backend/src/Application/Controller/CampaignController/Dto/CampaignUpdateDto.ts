/**
 * @typedef CampaignUpdateDto
 * @property {string} name - campaign name
 */

import * as Joi from 'joi';

export type CampaignUpdateDto = {
  name: string;
};

export const campaignUpdateDtoSchema = Joi.object<CampaignUpdateDto>({
  name: Joi.string().max(128).required(),
});
