import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { fetchSchemas } from './codexViewSlice';
import { EntriesListPanel } from './components/EntriesListPanel/EntriesListPanel';
import { EntryDisplayPanel } from './components/EntryDisplayPanel/EntryDisplayPanel';
import { SchemasList } from './components/SchemasList/SchemasList';

// TO-DO add updating campaign if user goes straight to /codex HIGH PRIORITY
// TO-DO improve CircularProgress
export const CodexView: React.FC = () => {
  const dispatch = useDispatch();

  const { campaignId } = useSelector((state: RootState) => state.campaignView);
  const { isSchemasListDownloaded, currentEntry } = useSelector(
    (state: RootState) => state.codexView
  );

  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewCampaign);

  if (!isSchemasListDownloaded) dispatch(fetchSchemas(campaignId));

  return (
    <ViewWithNavBarWrapper
      isPrimaryOpen={isOpen}
      setIsPrimaryOpen={setIsOpen}
      primaryDialogType={dialogType}
      setPrimaryDialogType={setDialogType}
    >
      {isSchemasListDownloaded ? (
        <Box>
          <SchemasList />
          {currentEntry ? <EntryDisplayPanel /> : <EntriesListPanel />}
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
