import { Paper, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateCurrentEntry } from '../../../../../../codexViewSlice';

type EntriesListElementProps = {
  name: string;
  objectId: string;
};

// why do we need to set background color for Typography?
export const EntriesListElement: React.FC<EntriesListElementProps> = props => {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(updateCurrentEntry({ newEntryId: props.objectId }));
  };

  return (
    <Paper
      square
      elevation={0}
      onClick={onClick}
      sx={{
        cursor: 'pointer',
      }}
    >
      <Typography
        variant={'h6'}
        sx={{
          color: 'customPalette.onSurface',
          backgroundColor: 'customPalette.surface',
          fontWeight: 'bold',
        }}
      >
        {props.name}
      </Typography>
    </Paper>
  );
};
