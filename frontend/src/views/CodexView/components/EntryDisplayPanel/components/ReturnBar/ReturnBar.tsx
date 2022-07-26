import { ArrowBack } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setCurrentEntry } from '../../../../codexViewSlice';

/**
 * Component responsible for displaying option to return from currently displayed entry
 * (EntryDisplayPanel) to list of all entries in selected schema (EntriesListPanel) on click
 * @returns
 */
export const ReturnBar: React.FC = () => {
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch(setCurrentEntry({ newEntry: null }));
  };

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
          fontWeight: 'medium',
          color: 'customPalette.onSurface',
          opacity: 0.8,
        }}
      >
        BACK
      </Typography>
    </Stack>
  );
};
