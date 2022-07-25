import { FabIcon } from '../../../types/types';
import { FabContentWrapper } from '../../components/FabContentWrapper/FabContentWrapper';

/**
 * Component used as Floating Action Button in StartView
 * where it opens StartDialog in "new campaign" mode
 * @returns
 */
export const StartFabContent: React.FC = () => (
  <FabContentWrapper icon={FabIcon.Add} text={'New campaign'} />
);
