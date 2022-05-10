import { Box, Paper, Stack, Typography } from '@mui/material';
import { NavBarViewDialog } from '../../../../../../types/types';
import { EmptyPlaceholder } from '../../../../../components/EmptyPlaceholder/EmptyPlaceholder';
import { Entry } from '../../../../codexSlice';
import { EntriesListElement } from './components/EntriesListElement/EntriesListElement';

type EntriesListProps = {
  title: string;
  entriesToRender: Entry[] | null;
  searchPhrase: string;
  setDialogType: (newDialogType: NavBarViewDialog) => void;
};

export const EntriesList: React.FC<EntriesListProps> = props => (
  <Box
    sx={{
      width: '100%',
      height: '100%',
      maxHeight: '100%',
    }}
  >
    {props.entriesToRender ? (
      <Paper
        elevation={6}
        sx={{
          backgroundColor: 'customPalette.surface',
          borderRadius: 3,
          overflowY: 'auto',
          width: '100%',
          height: 'calc(100vh - 150px)',
        }}
      >
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={1.5}
          sx={{
            paddingLeft: '25px',
            paddingRight: '25px',
            paddingTop: '15px',
            paddingBottom: '15px',
            width: 'calc(100% - 50px)',
          }}
        >
          <Typography
            variant={'h4'}
            sx={{
              color: 'customPalette.accent',
              fontWeight: 'medium',
              textTransform: 'uppercase',
            }}
          >
            {props.title}
          </Typography>
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={1}
            sx={{
              width: '100%',
            }}
          >
            {props.entriesToRender.map(entry => (
              <EntriesListElement
                entry={entry}
                key={entry.id}
                setDialogType={props.setDialogType}
              />
            ))}
          </Stack>
        </Stack>
      </Paper>
    ) : (
      <Box
        sx={{
          height: 'calc(100vh - 170px)',
          width: '100%',
        }}
      >
        <EmptyPlaceholder message={'Create an object for this schema, Wordsmith'} />
      </Box>
    )}
  </Box>
);
