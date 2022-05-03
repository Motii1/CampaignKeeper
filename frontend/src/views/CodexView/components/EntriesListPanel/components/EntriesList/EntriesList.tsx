import { Paper, Stack, Typography } from '@mui/material';
import { NavBarViewDialog } from '../../../../../../types/types';
import { EmptyPlaceholder } from '../../../../../components/EmptyPlaceholder/EmptyPlaceholder';
import { Entry } from '../../../../codexViewSlice';
import { EntriesListElement } from './components/EntriesListElement/EntriesListElement';

type EntriesListProps = {
  title: string;
  entriesToRender: Entry[];
  searchPhrase: string;
  setDialogType: (newDialogType: NavBarViewDialog) => void;
};

export const EntriesList: React.FC<EntriesListProps> = props => {
  const filteredEntries =
    props.searchPhrase === ''
      ? props.entriesToRender
      : props.entriesToRender.filter(entry => entry.title.includes(props.searchPhrase));

  return (
    <Paper
      elevation={6}
      sx={{
        backgroundColor: 'customPalette.surface',
        width: '100%',
        height: '100%',
      }}
    >
      {props.entriesToRender.length > 0 ? (
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={1.5}
          sx={{ margin: '20px' }}
        >
          <Typography variant={'h4'} sx={{ color: 'customPalette.accent' }}>
            {props.title}
          </Typography>
          <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
            {filteredEntries.map(entry => (
              <EntriesListElement
                name={entry.title}
                objectId={entry.id}
                key={entry.id}
                setDialogType={props.setDialogType}
              />
            ))}
          </Stack>
        </Stack>
      ) : (
        <EmptyPlaceholder message={'Create an object for this schema, Creator'} />
      )}
    </Paper>
  );
};
