import { Campaign } from '../../Domain/Campaign/Campaign';
import { saveCampaign } from '../../Infrastracture/Entity/Campaign/CampaignRepository';
import { MOCKED_USER } from './Token';

export const MOCKED_CAMPAIGN_ID = 1;

export const MOCKED_CAMPAIGN: Campaign = {
  id: MOCKED_CAMPAIGN_ID,
  name: 'mocked campaign',
  image: null,
  createdAt: new Date(),
  user: MOCKED_USER,
};

export const insertMockedCampaign = async (): Promise<void> => {
  await saveCampaign(MOCKED_CAMPAIGN);
};
