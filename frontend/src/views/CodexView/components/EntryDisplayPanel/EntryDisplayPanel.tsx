import { Paper, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { EmptyPlaceholder } from '../../../components/EmptyPlaceholder/EmptyPlaceholder';
import { MetadataInstance } from '../../codexViewSlice';
import { EntryField } from './components/EntryField/EntryField';
import { ReturnBar } from './components/ReturnBar/ReturnBar';

export const EntryDisplayPanel: React.FC = () => {
  const { currentSchema, currentEntry } = useSelector((state: RootState) => state.codexView);

  const renderEntriesFields = () => {
    const getMetadataByFieldName = (fieldName: string, metadata: MetadataInstance[]) =>
      metadata.filter(element => element.fieldName === fieldName);

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
        width: '60%',
        height: '100%',
        marginLeft: '20%',
        marginRight: '20%',
        marginTop: '5%',
        marginBottom: '5%',
      }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={1}
        sx={{ paddingLeft: '2%', paddingTop: '2%' }}
      >
        <ReturnBar />
        <Typography variant={'h4'} sx={{ color: 'customPalette.accent', marginTop: '2%' }}>
          {currentEntry.title}
        </Typography>
        {renderEntriesFields()}
      </Stack>
    </Paper>
  ) : (
    <EmptyPlaceholder message={'Impossible. Perhaps the archives are incomplete'} />
  );
};
