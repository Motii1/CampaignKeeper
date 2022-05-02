import { Paper, Stack, Typography } from '@mui/material';
import { EmptyPlaceholder } from '../../../../../components/EmptyPlaceholder/EmptyPlaceholder';
import { Entry } from '../../../../codexViewSlice';
import { EntriesListElement } from './components/EntriesListElement/EntriesListElement';

type EntriesListProps = {
  title: string;
  objectsToRender: Entry[];
};

export const EntriesList: React.FC<EntriesListProps> = props => (
  <Paper
    elevation={6}
    sx={{
      backgroundColor: 'customPalette.surface',
      width: '100%',
      height: '100%',
    }}
  >
    {props.objectsToRender.length > 0 ? (
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
          {props.objectsToRender.map(customObject => (
            <EntriesListElement
              name={customObject.title}
              objectId={customObject.id}
              key={customObject.id}
            />
          ))}
        </Stack>
      </Stack>
    ) : (
      <EmptyPlaceholder message={'Create an object for this schema, Creator'} />
    )}
  </Paper>
);
