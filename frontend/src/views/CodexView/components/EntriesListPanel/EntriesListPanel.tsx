import { Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { NavBarViewDialog } from '../../../../types/types';
import { EmptyPlaceholder } from '../../../components/EmptyPlaceholder/EmptyPlaceholder';
import { Entry } from '../../codexSlice';
import { EntriesList } from './components/EntriesList/EntriesList';
import { SearchBar } from './components/SearchBar/SearchBar';

type EntriesListPanelProps = {
  setDialogType: (newDialogType: NavBarViewDialog) => void;
};

export const EntriesListPanel: React.FC<EntriesListPanelProps> = props => {
  const { currentSchema, currentEntry } = useSelector((state: RootState) => state.codexView);
  const { entries } = useSelector((state: RootState) => state.codex);

  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [shownEntries, setShownEntries] = useState<Entry[] | null>(
    currentSchema ? entries[currentSchema.id] : null
  );

  const filterEntries = useCallback(() => {
    const searchPhraseLowercase = searchPhrase.toLowerCase();
    return currentSchema
      ? entries[currentSchema.id].filter(entry =>
          entry.title.toLowerCase().includes(searchPhraseLowercase)
        )
      : null;
  }, [currentSchema, entries, searchPhrase]);

  useEffect(() => setShownEntries(filterEntries()), [currentEntry, filterEntries]);

  if (currentSchema)
    return (
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={2}
        sx={{
          margin: '25px',
          height: '100%',
          maxHeight: '100%',
          width: '100%',
        }}
      >
        <SearchBar setSearchPhrase={setSearchPhrase} />
        <EntriesList
          title={currentSchema.title}
          entriesToRender={shownEntries}
          searchPhrase={searchPhrase}
          setDialogType={props.setDialogType}
        />
      </Stack>
    );
  return <EmptyPlaceholder message={'Select a schema, ye wise sage'} />;
};
