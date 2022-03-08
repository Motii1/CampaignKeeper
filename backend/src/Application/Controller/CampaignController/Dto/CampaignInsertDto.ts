/**
 * @typedef CampaignInsertDto
 * @property {string} name - name
 * @property {string} imageBase64 - image hashed in base64
 */

import * as Joi from 'joi';
import { MAX_CAMPAIGN_BASE64_STRING_LENGTH } from './Const';

export type CampaignInsertDto = {
  name: string;
  imageBase64?: string;
};

export const campaignInsertDtoSchema = Joi.object<CampaignInsertDto>({
  name: Joi.string().max(128).required(),
  imageBase64: Joi.string().base64().max(MAX_CAMPAIGN_BASE64_STRING_LENGTH),
});
