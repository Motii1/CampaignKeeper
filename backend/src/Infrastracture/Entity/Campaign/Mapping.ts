import { Campaign } from '../../../Domain/Campaign/Campaign';
import { mapEntityToDomainObject as schemaMapEntityToDomainObject } from '../Schema/Mapping';
import { mapEntityToDomainObject as sessionMapEntityToDomainObject } from '../Session/Mapping';
import { mapEntityToDomainObject as userMapEntityToDomainObject } from '../User/Mapping';
import { CampaignEntity } from './CampaignEntity';

export const mapEntityToDomainObject = (entity: CampaignEntity): Campaign => ({
  name: entity.name,
  createdAt: entity.createdAt,
  id: entity.id,
  image: entity.image,
  user: userMapEntityToDomainObject(entity.user),
  sessions: entity.sessions.map(sessionMapEntityToDomainObject),
  schemas: entity.schemas.map(schemaMapEntityToDomainObject),
});
