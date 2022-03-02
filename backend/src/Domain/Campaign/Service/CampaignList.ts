import { findAllUserCampaigns } from '../../../Infrastracture/Entity/Campaign/CampaignRepository';
import { User } from '../../User/User';
import { Campaign } from '../Campaign';
import { GetCampaignListDto, SingleGetCampaignListDto } from '../Dto/GetCampaignListDto';

export const provideUserCampaignList = async (user: User): Promise<GetCampaignListDto> => {
  const campaigns = await findAllUserCampaigns(user);
  return extractDtoData(campaigns);
};

const extractDtoData = (campaigns: Campaign[]): GetCampaignListDto =>
  campaigns.map(extractSingleDtoData);

export const extractSingleDtoData = ({
  id,
  name,
  schemas,
  sessions,
  createdAt,
  image,
}: Campaign): SingleGetCampaignListDto => ({
  id,
  name,
  schemas: schemas.map(({ id }) => ({ id })),
  sessions: sessions.map(({ id }) => ({ id })),
  createdAt,
  imageBase64: image?.toString('base64'),
});
