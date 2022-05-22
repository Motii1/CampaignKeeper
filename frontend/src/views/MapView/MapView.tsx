import { Stack } from '@mui/material';
import { useState } from 'react';
import { NavBarViewDialog } from '../../types/types';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { EventTile } from './components/EventTile/EventTile';
import { EventNode, sampleEventNodes } from './eventNodes';
import { setYPositions } from './graphExperiments';

export const MapView: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewCampaign);

  const eventNodes = setYPositions(sampleEventNodes);

  const renderRow = (nodes: EventNode[]) => (
    <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
      {nodes.map(node => (
        <EventTile key={node.id} id={node.id} title={node.title} />
      ))}
    </Stack>
  );

  const renderEventGraph = () => {
    const maxRow = Math.max(...eventNodes.map(node => node.y));
    const rowIndexes = Array.from(Array(maxRow + 1).keys());

    return (
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={4}
        sx={{ marginTop: '50px' }}
      >
        {rowIndexes.map(index => renderRow(eventNodes.filter(node => node.y === index)))}
      </Stack>
    );
  };

  return (
    <ViewWithNavBarWrapper
      isPrimaryOpen={isOpen}
      setIsPrimaryOpen={setIsOpen}
      primaryDialogType={dialogType}
      setPrimaryDialogType={setDialogType}
    >
      {renderEventGraph()}
    </ViewWithNavBarWrapper>
  );
};
