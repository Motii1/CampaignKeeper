import { getRepository } from 'typeorm';
import { Campaign } from '../../../Domain/Campaign/Campaign';
import { User } from '../../../Domain/User/User';
import { CampaignEntity } from './CampaignEntity';
import { mapEntityToDomainObject } from './Mapping';

export const findAllUserCampaigns = async (user: User): Promise<Campaign[]> => {
  const entities = await getRepository(CampaignEntity).find({ where: { user: { id: user.id } } });
  return entities.map(mapEntityToDomainObject);
};

export const findUserCampaignById = async (id: number, user: User): Promise<Campaign | null> => {
  const campaign = await getRepository(CampaignEntity).findOne({
    where: { id, user: { id: user.id } },
  });
  if (!campaign) {
    return null;
  }
  return mapEntityToDomainObject(campaign);
};

export const updateCampaignImageById = async (image: Buffer | null, id: number): Promise<void> => {
  await getRepository(CampaignEntity).update({ id }, { image });
};

export const deleteUserCampaignById = async (id: number, user: User): Promise<void> => {
  await getRepository(CampaignEntity).delete({ id, user: { id: user.id } });
};

export const saveCampaign = async (
  campaign: Omit<Campaign, 'id' | 'createdAt'>
): Promise<Campaign> => {
  const entity = await getRepository(CampaignEntity).save(campaign);
  return mapEntityToDomainObject(entity);
};
