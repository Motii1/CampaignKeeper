import { FabIcon } from '../../../types/types';
import { FabContentWrapper } from '../../components/FabContentWrapper/FabContentWrapper';

/**
 * Component used as Floating Action Button in Campaign
 * where it opens CampaignDialog in "new session" mode
 * @returns
 */
export const CampaignFabContet: React.FC = () => (
  <FabContentWrapper icon={FabIcon.Add} text={'New session'} />
);
