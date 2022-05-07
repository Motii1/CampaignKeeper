import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { EntriesListPanel } from './components/EntriesListPanel/EntriesListPanel';
import { EntryDisplayPanel } from './components/EntryDisplayPanel/EntryDisplayPanel';
import { NewSchemaDialog } from './components/NewSchemaDialog/NewSchemaDialog';
import { SchemasList } from './components/SchemasList/SchemasList';

// TO-DO add updating campaign if user goes straight to /codex HIGH PRIORITY
// TO-DO improve CircularProgress
export const CodexView: React.FC = () => {
  const { currentEntry } = useSelector((state: RootState) => state.codexView);

  const [isPrimaryOpen, setIsPrimaryOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewEntry);
  const [isSchemaDialogOpen, setIsSchemaDialogOpen] = useState(false);

  useEffect(() => {
    if (currentEntry) setDialogType(NavBarViewDialog.EditEntry);
    else setDialogType(NavBarViewDialog.NewEntry);
  }, [currentEntry]);

  return (
    <ViewWithNavBarWrapper
      isPrimaryOpen={isPrimaryOpen}
      setIsPrimaryOpen={setIsPrimaryOpen}
      primaryDialogType={dialogType}
      setPrimaryDialogType={setDialogType}
    >
      <Box sx={{ height: '100%', width: '100%' }}>
        <SchemasList setIsOpen={setIsSchemaDialogOpen} />
        <Box
          sx={{
            height: '100%',
            maxHeight: '100%',
            overflowY: 'auto',
          }}
        >
          <Box
            sx={{
              marginLeft: '230px',
              marginRight: { xs: '0px', md: '220px' },
              height: 'calc(100% - 25px)',
            }}
          >
            {currentEntry ? (
              <EntryDisplayPanel />
            ) : (
              <EntriesListPanel setDialogType={setDialogType} />
            )}
          </Box>
        </Box>
        <NewSchemaDialog isOpen={isSchemaDialogOpen} setIsOpen={setIsSchemaDialogOpen} />
      </Box>
    </ViewWithNavBarWrapper>
  );
};
