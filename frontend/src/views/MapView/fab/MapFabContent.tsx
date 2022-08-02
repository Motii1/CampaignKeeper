import { FabIcon } from '../../../types/types';
import { FabContentWrapper } from '../../components/FabContentWrapper/FabContentWrapper';

/**
 * Component used as Floating Action Button in Map where it opens MapDialog
 * in "new event" mode, allowing creation of new event
 * @returns
 */
export const MapFabContent: React.FC = () => (
  <FabContentWrapper icon={FabIcon.Add} text="New entry" />
);
