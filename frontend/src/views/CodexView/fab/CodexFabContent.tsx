import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { FabIcon } from '../../../types/types';
import { FabContentWrapper } from '../../components/FabContentWrapper/FabContentWrapper';

/**
 * Component used as Floating Action Button in Codex where it opens CodexDialog in:
 *  - "new entry" mode if only schema is selected
 *  - "edit entry" mode if entry (and therefore schema) is selected
 * @returns
 */
export const CodexFabContent: React.FC = () => {
  const { currentEntry } = useSelector((state: RootState) => state.codexView);

  return (
    <FabContentWrapper
      icon={currentEntry ? FabIcon.Edit : FabIcon.Add}
      text={currentEntry ? 'Edit entry' : 'New entry'}
    />
  );
};
