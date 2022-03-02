import * as fs from 'fs/promises';
import { updateCampaignImageById } from '../../../Infrastracture/Entity/Campaign/CampaignRepository';

export const handleCampaignImagePersistance = async (
  { path }: Express.Multer.File,
  campaignId: number
): Promise<void> => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const image = await fs.readFile(path);
  await updateCampaignImageById(image, campaignId);
};
