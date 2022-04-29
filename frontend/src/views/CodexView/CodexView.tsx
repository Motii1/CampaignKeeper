import { Stack } from '@mui/material';
import { useState } from 'react';
import { NavBarViewDialog } from '../../types/types';
import { ViewWithNavBarWrapper } from '../components/ViewWithNavBarWrapper/ViewWithNavBarWrapper';
import { MainPanel } from './components/MainPanel/MainPanel';
import { SchemasList } from './components/SchemasList/SchemasList';
import { SearchBar } from './components/SearchBar/SearchBar';

export const CodexView: React.FC = () => {
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
