import { useState } from 'react';
import { NavBarViewDialog } from '../../types/types';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { EventTile } from './components/EventTile/EventTile';
import { eventNodes } from './eventNodes';
import { setYPositions } from './graphExperiments';

export const MapView: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewCampaign);

  // eslint-disable-next-line no-console
  console.log(setYPositions(eventNodes));

  return (
    <ViewWithNavBarWrapper
      isPrimaryOpen={isOpen}
      setIsPrimaryOpen={setIsOpen}
      primaryDialogType={dialogType}
      setPrimaryDialogType={setDialogType}
    >
      <EventTile id={'1'} title={'1'} />
    </ViewWithNavBarWrapper>
  );
};
