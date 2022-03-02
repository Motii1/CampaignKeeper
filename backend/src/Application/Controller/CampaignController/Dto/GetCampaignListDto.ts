/**
 * @typedef SingleGetCampaignListDto
 * @property {string} id - campaign id
 * @property {string} name - campaign name
 * @property {string} schemas - schemas id's list
 * @property {string} sessions - sessions id's list
 * @property {string} createdAt - created date
 * @property {string} imageBase64 - campaign image hashed in base64
 */
/**
 * @typedef GetCampaignListDto
 * @property {Array.<SingleGetCampaignListDto>} campaigns - array of campaigns dto data
 */

import { GetCampaignListDto as dto } from '../../../../Domain/Campaign/Dto/GetCampaignListDto';

export type GetCampaignListDto = { campaigns: Required<dto> };
