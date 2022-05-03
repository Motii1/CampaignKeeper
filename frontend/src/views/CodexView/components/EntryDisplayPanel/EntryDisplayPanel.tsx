import { Paper, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { EmptyPlaceholder } from '../../../components/EmptyPlaceholder/EmptyPlaceholder';
import { getMetadataByFieldName } from '../utils';
import { EntryField } from './components/EntryField/EntryField';
import { ReturnBar } from './components/ReturnBar/ReturnBar';

export const EntryDisplayPanel: React.FC = () => {
  const { currentSchema, currentEntry } = useSelector((state: RootState) => state.codexView);

  const renderEntriesFields = () => {
    if (currentEntry) {
      const fields = currentSchema?.fields.map(fieldName =>
        getMetadataByFieldName(fieldName, currentEntry.metadataArray)
      );
      if (fields)
        return fields.map(field => (
          <EntryField key={field[0].fieldName} fieldName={field[0].fieldName} data={field} />
        ));
    }
    return null;
  };

  return currentEntry ? (
    <Paper
      elevation={6}
      sx={{
        backgroundColor: 'customPalette.surface',
      }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={1}
        sx={{ padding: '2%' }}
      >
        <ReturnBar />
        <Typography
          variant={'h4'}
          sx={{ color: 'customPalette.accent', fontWeight: 'bold', marginTop: '2%' }}
        >
          {currentEntry.title}
        </Typography>
        {renderEntriesFields()}
      </Stack>
    </Paper>
  ) : (
    <EmptyPlaceholder message={'Impossible. Perhaps the archives are incomplete'} />
  );
};
