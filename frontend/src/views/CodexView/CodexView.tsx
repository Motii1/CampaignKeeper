import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import viewsRoutes from '../viewsRoutes';
import { fetchSchemasAndEntries } from './codexSlice';
import { updateCampaignId } from './codexViewSlice';
import { EntriesListPanel } from './components/EntriesListPanel/EntriesListPanel';
import { EntryDisplayPanel } from './components/EntryDisplayPanel/EntryDisplayPanel';
import { SchemasList } from './components/SchemasList/SchemasList';

/**
 * Component responsible for UI and logic of CodexView which displays schemas and their instances
 * (codex entries) from currently selected campaign, allows creation on new schema
 * as well as new entries and editing/deleting existing ones
 */
export const CodexView: React.FC = () => {
  const dispatch = useDispatch();
  const { currentCampaignId } = useSelector((state: RootState) => state.campaignView);
  const { codexCampaignId, currentSchema, currentEntry } = useSelector(
    (state: RootState) => state.codexView
  );
  const { isCodexDownloaded } = useSelector((state: RootState) => state.codex);

  const history = useHistory();

  const [isPrimaryOpen, setIsPrimaryOpen] = useState(false);
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewEntry);

  useEffect(() => {
    if (currentEntry) setDialogType(NavBarViewDialog.EditEntry);
    else setDialogType(NavBarViewDialog.NewEntry);
  }, [currentEntry]);

  useEffect(() => {
    if (currentCampaignId === '') history.push(viewsRoutes.CAMPAIGN);
    else if (!isCodexDownloaded || codexCampaignId !== currentCampaignId) {
      dispatch(fetchSchemasAndEntries(currentCampaignId));
      dispatch(updateCampaignId({ campaignId: currentCampaignId }));
    }
  }, [codexCampaignId, currentCampaignId, dispatch, history, isCodexDownloaded]);

  return (
    <ViewWithNavBarWrapper
      isPrimaryOpen={isPrimaryOpen}
      setIsPrimaryOpen={setIsPrimaryOpen}
      primaryDialogType={dialogType}
      setPrimaryDialogType={setDialogType}
      isSecondaryOpen={isSecondaryOpen}
      setIsSecondaryOpen={setIsSecondaryOpen}
      handleFab={currentSchema || currentEntry ? () => setIsPrimaryOpen(!isPrimaryOpen) : undefined}
    >
      <Box sx={{ height: '100%', width: '100%' }}>
        <SchemasList />
        <Box
          sx={{
            height: '100%',
            maxHeight: '100%',
            overflowY: 'auto',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: '230px',
              right: { xs: '0px', md: '230px' },
              top: '50px',
              bottom: '50px',
              height: 'calc(100% - 94px)',
            }}
          >
            {currentEntry ? (
              <EntryDisplayPanel />
            ) : (
              <EntriesListPanel setDialogType={setDialogType} />
            )}
          </Box>
        </Box>
      </Box>
    </ViewWithNavBarWrapper>
  );
};
