import { Campaign } from '../../../Domain/Campaign/Campaign';
import { mapEntityToDomainObject as userMapEntityToDomainObject } from '../User/Mapping';
import { CampaignEntity } from './CampaignEntity';

export const mapEntityToDomainObject = (entity: CampaignEntity): Campaign => ({
  name: entity.name,
  createdAt: entity.createdAt,
  id: entity.id,
  image: entity.image,
  user: userMapEntityToDomainObject(entity.user),
});
