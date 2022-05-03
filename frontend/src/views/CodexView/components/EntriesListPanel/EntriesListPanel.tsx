import { CircularProgress, Stack } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { NavBarViewDialog } from '../../../../types/types';
import { EmptyPlaceholder } from '../../../components/EmptyPlaceholder/EmptyPlaceholder';
import { EntriesList } from './components/EntriesList/EntriesList';
import { SearchBar } from './components/SearchBar/SearchBar';

type EntriesListPanelProps = {
  setDialogType: (newDialogType: NavBarViewDialog) => void;
};

export const EntriesListPanel: React.FC<EntriesListPanelProps> = props => {
  const { currentSchema, entries } = useSelector((state: RootState) => state.codexView);

  const [searchPhrase, setSearchPhrase] = useState<string>('');

  if (currentSchema)
    return entries[currentSchema.id] ? (
      <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={2}>
        <SearchBar setSearchPhrase={setSearchPhrase} />
        <EntriesList
          title={currentSchema.title}
          entriesToRender={entries[currentSchema.id]}
          searchPhrase={searchPhrase}
          setDialogType={props.setDialogType}
        />
      </Stack>
    ) : (
      <CircularProgress size={35} thickness={6} sx={{ color: 'customPalette.accent' }} />
    );
  return <EmptyPlaceholder message={'Select a schema, ye wise sage'} />;
};
