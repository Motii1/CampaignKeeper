import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { FabIcon } from '../../../types/types';
import { FabContentWrapper } from '../../components/FabContentWrapper/FabContentWrapper';

export const CodexFabContent: React.FC = () => {
  const { currentEntry } = useSelector((state: RootState) => state.codexView);

  return <FabContentWrapper icon={FabIcon.Add} text={currentEntry ? 'Edit entry' : 'New entry'} />;
};
