import { Paper, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { NavBarViewDialog } from '../../../types/types';
import { CustomSnackbar } from '../CustomSnackbar/CustomSnackbar';
import { useSnackbar } from '../CustomSnackbar/useSnackbar';
import { DialogWrapper } from './components/CustomDialogWrapper/CustomDialogWrapper';
import { CustomFab } from './components/CustomFab/CustomFab';
import { NavBar } from './components/NavBar/NavBar';
import { SecondaryDialogWrapper } from './components/SecondaryCustomDialogWrapper/SecondaryCustomDialogWrapper';

type ViewWithNavBarWrapperProps = {
  isPrimaryOpen: boolean;
  setIsPrimaryOpen: (newIsOpen: boolean) => void;
  primaryDialogType: NavBarViewDialog;
  setPrimaryDialogType: (newType: NavBarViewDialog) => void;
  isSecondaryOpen?: boolean;
  setIsSecondaryOpen?: (newIsOpen: boolean) => void;
  handleFab?: () => void;
};

export const ViewWithNavBarWrapper: React.FC<ViewWithNavBarWrapperProps> = props => {
  const currentView = useLocation().pathname;

  const { snackbarProperties, setSnackbarInfo, setSnackbarSuccess, setSnackbarError } =
    useSnackbar();

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
        <NavBar
          currentView={currentView}
          setSnackbarInfo={setSnackbarInfo}
          setSnackbarSuccess={setSnackbarSuccess}
          setSnackbarError={setSnackbarError}
        />
        {props.children}
      </Stack>
      <CustomFab
        currentView={currentView}
        handleClick={
          props.handleFab ? props.handleFab : () => props.setIsPrimaryOpen(!props.isPrimaryOpen)
        }
      />
      <DialogWrapper
        currentView={currentView}
        isOpen={props.isPrimaryOpen}
        dialogType={props.primaryDialogType}
        setIsOpen={props.setIsPrimaryOpen}
        setIsSecondaryOpen={props.setIsSecondaryOpen}
        setSnackbarInfo={setSnackbarInfo}
        setSnackbarSuccess={setSnackbarSuccess}
        setSnackbarError={setSnackbarError}
      />
      {props.isSecondaryOpen && props.setIsSecondaryOpen ? (
        <SecondaryDialogWrapper
          currentView={currentView}
          isOpen={props.isSecondaryOpen}
          setIsOpen={props.setIsSecondaryOpen}
          setIsPrimaryOpen={props.setIsPrimaryOpen}
          setSnackbarInfo={setSnackbarInfo}
          setSnackbarSuccess={setSnackbarSuccess}
          setSnackbarError={setSnackbarError}
        />
      ) : null}
      <CustomSnackbar
        message={snackbarProperties.message}
        type={snackbarProperties.type}
        isOpen={snackbarProperties.isOpen}
        setIsOpen={snackbarProperties.setIsOpen}
      />
    </Paper>
  );
};
