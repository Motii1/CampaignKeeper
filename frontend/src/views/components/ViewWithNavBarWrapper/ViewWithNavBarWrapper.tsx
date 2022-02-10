import { Paper, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { CustomDialogWrapper } from './components/CustomDialogWrapper/CustomDialogWrapper';
import { CustomFab } from './components/CustomFab/CustomFab';
import { NavBar } from './components/NavBar/NavBar';

type ViewWithNavBarWrapperProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  isSecondaryOpen?: boolean;
  setIsSecondaryOpen?: (newIsOpen: boolean) => void;
};

export const ViewWithNavBarWrapper: React.FC<ViewWithNavBarWrapperProps> = props => {
  const currentView = useLocation().pathname;
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
      <CustomFab currentView={currentView} setIsOpen={props.setIsOpen} />
      <CustomDialogWrapper
        currentView={currentView}
        isOpen={props.isOpen}
        setIsOpen={props.setIsOpen}
      />
    </Paper>
  );
};
