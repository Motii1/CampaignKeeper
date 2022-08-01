import { Box, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { NavBarViewDialog } from '../../../../../../../../types/types';
import { Entry } from '../../../../../../codexSlice';
import { setCurrentEntry } from '../../../../../../codexViewSlice';

type EntriesListElementProps = {
  entry: Entry;
  setDialogType: (newDialogType: NavBarViewDialog) => void;
};

/**
 * Component reponsible for displaying name of entry,
 * allows opening it in EntryDisplayPanel on click
 */
export const EntriesListElement: React.FC<EntriesListElementProps> = props => {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(setCurrentEntry({ newEntry: props.entry }));
    props.setDialogType(NavBarViewDialog.EditEntry);
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        backgroundColor: 'transparent',
      }}
    >
      <Typography
        variant={'h6'}
        sx={{
          color: 'customPalette.onSurface',
          fontWeight: 'medium',
          '&:hover': {
            opacity: 0.8,
          },
        }}
      >
        {props.entry.title}
      </Typography>
    </Box>
  );
};
