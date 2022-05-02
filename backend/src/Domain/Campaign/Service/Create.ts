import { CampaignInsertDto } from '../../../Application/Controller/CampaignController/Dto/CampaignInsertDto';
import { saveCampaign } from '../../../Infrastracture/Entity/Campaign/CampaignRepository';
import { User } from '../../User/User';
import { Campaign } from '../Campaign';
import { SingleGetCampaignListDto } from '../Dto/GetCampaignListDto';
import { insertDefaultSchemas } from '../Schema/DefaultSchema';
import { extractSingleDtoData } from './CampaignList';

export const createCampaign = async (
  { name, imageBase64 }: CampaignInsertDto,
  user: User
): Promise<SingleGetCampaignListDto> => {
  const campaign: Omit<Campaign, 'id' | 'createdAt'> = {
    image: imageBase64 ? Buffer.from(imageBase64, 'base64') : null,
    name,
    user,
  };
  const savedCampaign = await saveCampaign(campaign);
  await insertDefaultSchemas(savedCampaign.id);
  return extractSingleDtoData(savedCampaign);
};
