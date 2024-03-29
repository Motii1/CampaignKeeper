import { Box, Paper, Stack, Typography } from '@mui/material';
import { NavBarViewDialog } from '../../../../../../types/types';
import { EmptyPlaceholder } from '../../../../../components/EmptyPlaceholder/EmptyPlaceholder';
import { Entry } from '../../../../codexSlice';
import { EntriesListElement } from './components/EntriesListElement/EntriesListElement';

type EntriesListProps = {
  title: string;
  entriesToRender: Entry[];
  searchPhrase: string;
  setDialogType: (newDialogType: NavBarViewDialog) => void;
};

/**
 * Component responsible for displaying names of entries from currently selected schema
 * (optionally filtered by search phrase)
 * @param props
 * @returns
 */
export const EntriesList: React.FC<EntriesListProps> = props => {
  const renderListElements = () =>
    props.entriesToRender.map(entry => (
      <EntriesListElement entry={entry} key={entry.id} setDialogType={props.setDialogType} />
    ));

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        maxHeight: '100%',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'customPalette.surface',
          borderRadius: 3,
          overflowY: 'auto',
          width: '100%',
          height: 'calc(100vh - 155px)',
        }}
      >
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={1.5}
          sx={{
            paddingLeft: '25px',
            paddingTop: '15px',
            width: 'calc(100% - 25px)',
            height: 'calc(100% - 15px)',
          }}
        >
          <Typography
            variant={'h4'}
            sx={{
              color: 'customPalette.onBackgroundVariant',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            {props.title}
          </Typography>
          {props.entriesToRender.length !== 0 ? (
            <Paper
              elevation={0}
              sx={{
                backgroundColor: 'transparent',
                height: '100%',
                width: '100%',
                overflowY: 'auto',
              }}
            >
              <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={1}
                sx={{
                  width: '100%',
                  paddingBottom: '15px',
                }}
              >
                {renderListElements()}
              </Stack>
            </Paper>
          ) : (
            <Box
              sx={{
                height: 'calc(100vh - 170px)',
                width: '100%',
              }}
            >
              <EmptyPlaceholder
                message={
                  props.searchPhrase === ''
                    ? 'Create an object for this schema, Wordsmith'
                    : 'No entries matches your query, my liege'
                }
              />
            </Box>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};
