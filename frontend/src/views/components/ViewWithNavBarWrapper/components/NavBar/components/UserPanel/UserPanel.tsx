import { MoreVert } from '@mui/icons-material';
import { Avatar, Box, Menu, MenuItem, Paper, Stack, Typography } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import protectedApiClient from '../../../../../../../axios/axios';
import { AppDispatch, RootState } from '../../../../../../../store';
import { AUTH_URL } from '../../../../../../LandingView/forms/RegisterForm';
import { clearDetails } from '../../../../../../LandingView/userDetailsSlice';
import viewsRoutes from '../../../../../../viewsRoutes';
import { CustomDialog } from '../../../../../CustomDialog/CustomDialog';
import { AboutDialogContent } from './components/AboutDialogContent/AboutDialogContent';
import { SettingsDialogContent } from './components/SettingsDialogContent/SettingsDialogContent';

export const UserPanel: React.FC = () => {
  const { username, avatar } = useSelector((state: RootState) => state.user);
  const [menuAnchor, setMenuAnchor] = useState<null | Element>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDialogTitle, setcurrentDialogTitle] = useState<string>('About');
  const dispatch = useDispatch();
  const history = useHistory();

  const handleMoreVertClick = (event: React.MouseEvent<Element>) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleClose = () => {
    setMenuAnchor(null);
  };

  const handleSettingsClick = () => {
    handleClose();
    setcurrentDialogTitle('Settings');
    setIsDialogOpen(true);
  };

  const handleAboutClick = () => {
    handleClose();
    setcurrentDialogTitle('About');
    setIsDialogOpen(true);
  };

  const handleLogoutClick = async () => {
    handleClose();
    const response = await logout(dispatch);
    if (response.status === 200) history.push(viewsRoutes.LANDING);
    else history.push(viewsRoutes.ERROR);
  };

  return (
    <Box sx={{ marginLeft: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'customPalette.accent',
          height: 50,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingLeft: 0.5,
          paddingRight: 0.5,
          marginLeft: 'auto',
        }}
        square
      >
        <Stack direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
          <Paper
            elevation={0}
            sx={{
              backgroundColor: 'customPalette.surface',
              height: 35,
              width: 35,
              overflow: 'visible',
              zIndex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              marginLeft: 1,
              marginRight: 0.5,
            }}
          >
            <Avatar
              alt={String(username)}
              src={`data:;charset=utf-8;base64,${avatar}`}
              sx={{ width: 30.5, height: 30.5, imageRendering: 'pixelated' }}
            />
          </Paper>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'customPalette.onAccent',
              fontWeight: 'bold',
            }}
          >
            {username}
          </Typography>
          <MoreVert
            onClick={handleMoreVertClick}
            sx={{
              color: 'customPalette.onAccent',
              paddingLeft: 0.5,
              paddingRight: 1,
            }}
          />
        </Stack>
      </Paper>
      <Menu
        id="user-menu"
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'customPalette.primary',
            borderRadius: 4,
          },
        }}
        disableAutoFocusItem
      >
        <MenuItem onClick={handleSettingsClick}>Settings</MenuItem>
        <MenuItem onClick={handleAboutClick}>About</MenuItem>
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </Menu>
      <CustomDialog
        title={currentDialogTitle}
        hasButtons={false}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
      >
        {currentDialogTitle === 'About' ? <AboutDialogContent /> : <SettingsDialogContent />}
      </CustomDialog>
    </Box>
  );
};

//TO-DO incorporate into UserPanel as runQuery
const logout = (dispatch: AppDispatch): Promise<AxiosResponse> => {
  dispatch(clearDetails({}));
  return protectedApiClient.post(`${AUTH_URL}/logout`, {});
};
