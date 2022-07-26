import { FabIcon } from '../../../types/types';
import { FabContentWrapper } from '../../components/FabContentWrapper/FabContentWrapper';

/**
 * Component used as Floating Action Button in ExplorerView
 * where it opens ExplorerDialog
 * @returns
 */
export const ExplorerFabContent: React.FC = () => (
  <FabContentWrapper icon={FabIcon.Edit} text="Edit" />
);
