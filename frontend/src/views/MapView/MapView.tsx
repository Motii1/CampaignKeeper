import { Stack } from '@mui/material';
import { useState } from 'react';
import { NavBarViewDialog } from '../../types/types';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { EventWrapper } from './components/EventWrapper/EventWrapper';
import { EventNode, shortGraphNodes } from './eventNodes';
import { setYPositions } from './graphExperiments';

export const MapView: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewCampaign);

  const eventNodes = setYPositions(shortGraphNodes);

  const renderRow = (nodes: EventNode[]) => (
    <Stack key={nodes[0].y} direction="row" justifyContent="center" alignItems="center" spacing={4}>
      {nodes.map(node => (
        <EventWrapper key={node.id} id={node.id} title={node.title} parentIDs={node.parentIDs} />
      ))}
    </Stack>
  );

  const renderEventGraphNodes = () => {
    const maxRow = Math.max(...eventNodes.map(node => node.y));
    const rowIndexes = Array.from(Array(maxRow + 1).keys());

    return (
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={8}
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
      {renderEventGraphNodes()}
    </ViewWithNavBarWrapper>
  );
};
