import { ArrowBack } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateCurrentEntry } from '../../../../codexViewSlice';

export const ReturnBar: React.FC = () => {
  const dispatch = useDispatch();
  const onClick = () => dispatch(updateCurrentEntry({ newEntryId: null }));

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={1.8}
      onClick={onClick}
      sx={{ cursor: 'pointer' }}
    >
      <ArrowBack sx={{ color: 'customPalette.onSurface', opacity: 0.8 }} />
      <Typography
        variant="h6"
        sx={{
          paddingTop: 0.2,
          fontSize: 18,
          fontWeight: 'bold',
          color: 'customPalette.onSurface',
          opacity: 0.8,
        }}
      >
        {'BACK'}
      </Typography>
    </Stack>
  );
};