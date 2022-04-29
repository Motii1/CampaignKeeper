import { Stack } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { NavBarViewDialog } from '../../types/types';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { fetchSchemas } from './codexViewSlice';
import { MainPanel } from './components/MainPanel/MainPanel';
import { SchemasList } from './components/SchemasList/SchemasList';
import { SearchBar } from './components/SearchBar/SearchBar';

export const CodexView: React.FC = () => {
  const dispatch = useDispatch();

  const { campaignId } = useSelector((state: RootState) => state.campaignView);
  const { isSchemasListDownloaded } = useSelector((state: RootState) => state.codexView);
  if (!isSchemasListDownloaded) dispatch(fetchSchemas(campaignId));

  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<NavBarViewDialog>(NavBarViewDialog.NewCampaign);
  return (
    <ViewWithNavBarWrapper
      isPrimaryOpen={isOpen}
      setIsPrimaryOpen={setIsOpen}
      primaryDialogType={dialogType}
      setPrimaryDialogType={setDialogType}
    >
      <SchemasList />
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{ margin: '20%', width: '60%' }}
      >
        <SearchBar />
        <MainPanel title={'NPCs'} />
      </Stack>
    </ViewWithNavBarWrapper>
  );
};
