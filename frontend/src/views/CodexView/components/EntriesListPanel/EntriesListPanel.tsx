import { CircularProgress, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { EmptyPlaceholder } from '../../../components/EmptyPlaceholder/EmptyPlaceholder';
import { EntriesList } from './components/EntriesList/EntriesList';
import { SearchBar } from './components/SearchBar/SearchBar';

// TO-DO add method for creating SchemaInstance and SchemaIstance React.FC
// TO-DO add scroll for long list of objects
export const EntriesListPanel: React.FC = () => {
  const { currentSchema, entries } = useSelector((state: RootState) => state.codexView);

  if (currentSchema)
    return entries[currentSchema.id] ? (
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={2}
        sx={{
          width: '60%',
          height: '100%',
          marginLeft: '20%',
          marginRight: '20%',
          marginTop: '10%',
          marginBottom: '10%',
        }}
      >
        <SearchBar />
        <EntriesList title={currentSchema.title} objectsToRender={entries[currentSchema.id]} />
      </Stack>
    ) : (
      <CircularProgress size={35} thickness={6} sx={{ color: 'customPalette.accent' }} />
    );
  return <EmptyPlaceholder message={'Select a schema, ye wise sage'} />;
};
