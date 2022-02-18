import { FabIcon } from '../../../types/types';
import { FabContentWrapper } from '../../components/FabContentWrapper/FabContentWrapper';

export const StartFabContent: React.FC = () => (
  <FabContentWrapper icon={FabIcon.Add} text={'New campaign'} />
);
