import { Paper, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateCurrentSchemaId } from '../../../../../../codexViewSlice';

type ObjectInstance = {
  name: string;
  objectId: string;
};

// why we need to set background color for Typography manually?
export const ObjectInstance: React.FC<ObjectInstance> = props => {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(updateCurrentSchemaId({ currentObjectId: props.objectId }));
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
