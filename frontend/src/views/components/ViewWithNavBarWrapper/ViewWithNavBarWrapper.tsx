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
      sx={{
        height: '100vh',
        width: '100%',
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
        <Paper
          square
          sx={{
            height: '100%',
            width: '100%',
            backgroundColor: 'transparent',
            margin: 'auto',
          }}
        >
          {props.children}
        </Paper>
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
