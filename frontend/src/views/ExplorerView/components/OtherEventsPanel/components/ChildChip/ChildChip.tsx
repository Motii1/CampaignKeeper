import { Paper, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { SessionEventWithPos } from '../../../../../MapView/eventsSlice';
import { setCurrentEvent } from '../../../../explorerViewSlice';

type ChildChipProps = {
  event: SessionEventWithPos;
};

/**
 * Component serving as button allowing to select event
 * which name it displays as currently selected event in ExplorerView
 * @param props
 * @returns
 */
export const ChildChip: React.FC<ChildChipProps> = props => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setCurrentEvent({ currentEvent: props.event }));
  };

  return (
    <Paper
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        borderRadius: '18px',
        backgroundColor:
          props.event.type === 'normal' ? 'customPalette.accent' : 'customPalette.red',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          color: props.event.type === 'normal' ? 'customPalette.onAccent' : 'customPalette.onRed',
          padding: '10px 20px 10px 20px',
        }}
      >
        {props.event.title}
      </Typography>
    </Paper>
  );
};
