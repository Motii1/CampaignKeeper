import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';

export const ExplorerView: React.FC = () => {
  const { currentEvent } = useSelector((state: RootState) => state.explorerView);

  // eslint-disable-next-line no-console
  console.log(currentEvent);

  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewCampaign);
  return (
    <ViewWithNavBarWrapper
      isPrimaryOpen={isOpen}
      setIsPrimaryOpen={setIsOpen}
      primaryDialogType={dialogType}
      setPrimaryDialogType={setDialogType}
    />
  );
};
