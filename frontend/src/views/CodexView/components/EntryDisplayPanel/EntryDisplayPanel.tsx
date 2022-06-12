import { Box, Paper, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { convertEntriesHashMapToList, getMetadataByFieldName } from '../../../../utils/utils';
import { EmptyPlaceholder } from '../../../components/EmptyPlaceholder/EmptyPlaceholder';
import { EntryField } from './components/EntryField/EntryField';
import { ReturnBar } from './components/ReturnBar/ReturnBar';

export const EntryDisplayPanel: React.FC = () => {
  const { currentSchema, currentEntry } = useSelector((state: RootState) => state.codexView);
  const { entries } = useSelector((state: RootState) => state.codex);

  const renderEntriesFields = () => {
    if (currentEntry) {
      const entriesAsList = convertEntriesHashMapToList(entries);
      const fields = currentSchema?.fields.map(fieldName =>
        getMetadataByFieldName(fieldName, currentEntry.metadataArray)
      );
      if (fields)
        return fields.map(field => (
          <EntryField
            key={field[0].fieldName}
            fieldName={field[0].fieldName}
            data={field}
            entries={entriesAsList}
          />
        ));
    }
    return null;
  };

  const renderEntriesImage = () =>
    currentEntry?.imageBase64 ? (
      <Box
        component="img"
        alt="Entry graphic"
        src={`data:;charset=utf-8;base64,${currentEntry.imageBase64}`}
        sx={{
          marginBottom: '15px',
          borderRadius: 2,
          height: 320,
          width: 200,
          objectFit: 'cover',
        }}
      />
    ) : null;

  return currentEntry ? (
    <Paper
      elevation={6}
      sx={{
        backgroundColor: 'customPalette.surface',
        borderRadius: 3,
        marginLeft: '25px',
        marginRight: '25px',
        marginTop: '25px',
        height: '100%',
        width: '100%',
      }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={1}
        sx={{
          paddingLeft: '25px',
          paddingTop: '15px',
          height: 'calc(100% - 15px)',
          width: 'calc(100% - 25px)',
        }}
      >
        <ReturnBar />
        <Typography
          variant={'h4'}
          sx={{
            color: 'customPalette.onBackgroundSecondary',
            fontWeight: 'medium',
            marginTop: '25px',
          }}
        >
          {currentEntry.title}
        </Typography>
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
            direction="row"
            justifyContent="start"
            alignItems="flex-start"
            spacing={2.7}
            sx={{
              width: '100%',
              minWidth: '100%',
            }}
          >
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
              spacing={1}
              sx={{
                paddingBottom: '15px',
                minWidth: 'calc(100% - 250px)',
                maxWidth: 'calc(100% - 250px)',
              }}
            >
              {renderEntriesFields()}
            </Stack>
            {renderEntriesImage()}
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  ) : (
    <EmptyPlaceholder
      message={'Impossible. Perhaps the archives are incomplete... (entry not found)'}
    />
  );
};
