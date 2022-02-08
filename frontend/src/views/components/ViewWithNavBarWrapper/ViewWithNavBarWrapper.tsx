import { Paper, Stack } from '@mui/material';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CustomDialogWrapper } from './components/CustomDialogWrapper/CustomDialogWrapper';
import { CustomFab } from './components/CustomFab/CustomFab';
import { NavBar } from './components/NavBar/NavBar';

export const ViewWithNavBarWrapper: React.FC = props => {
  const currentView = useLocation().pathname;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Paper
      square
      elevation={0}
      sx={{
        height: '100vh',
        maxHeight: '100%',
        width: '100%',
        position: 'absolute',
        backgroundColor: 'customPalette.background',
      }}
    >
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="stretch"
        spacing={0}
        sx={{
          height: '100%',
          width: '100%',
        }}
      >
        <NavBar currentView={currentView} />
        {props.children}
      </Stack>
      <CustomFab currentView={currentView} setIsOpen={setIsDialogOpen} />
      <CustomDialogWrapper
        currentView={currentView}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
      />
    </Paper>
  );
};
