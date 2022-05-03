import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { fetchSchemas } from './codexViewSlice';
import { EntriesListPanel } from './components/EntriesListPanel/EntriesListPanel';
import { EntryDisplayPanel } from './components/EntryDisplayPanel/EntryDisplayPanel';
import { NewSchemaDialog } from './components/NewSchemaDialog/NewSchemaDialog';
import { SchemasList } from './components/SchemasList/SchemasList';

// TO-DO add updating campaign if user goes straight to /codex HIGH PRIORITY
// TO-DO improve CircularProgress
export const CodexView: React.FC = () => {
  const dispatch = useDispatch();

  const { campaignId } = useSelector((state: RootState) => state.campaignView);
  const { isSchemasListDownloaded, currentEntry } = useSelector(
    (state: RootState) => state.codexView
  );

  const [isPrimaryOpen, setIsPrimaryOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewEntry);
  const [isSchemaDialogOpen, setIsSchemaDialogOpen] = useState(false);

  if (!isSchemasListDownloaded) dispatch(fetchSchemas(campaignId));

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
      {isSchemasListDownloaded ? (
        <Box>
          <Box
            sx={{
              width: '60%',
              height: 'auto',
              paddingLeft: '20%',
              paddingRight: '20%',
              paddingTop: '2%',
              paddingBottom: '2%',
            }}
          >
            <SchemasList setIsOpen={setIsSchemaDialogOpen} />
            {currentEntry ? (
              <EntryDisplayPanel />
            ) : (
              <EntriesListPanel setDialogType={setDialogType} />
            )}
          </Box>
          <NewSchemaDialog isOpen={isSchemaDialogOpen} setIsOpen={setIsSchemaDialogOpen} />
        </Box>
      ) : (
        <CircularProgress
          size={90}
          thickness={6}
          sx={{ color: 'customPalette.accent', margin: 'auto' }}
        />
      )}
    </ViewWithNavBarWrapper>
  );
};
