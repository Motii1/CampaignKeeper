import { MoreVert } from '@mui/icons-material';
import { Box, Container, Menu, MenuItem, Paper, Stack, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import protectedApiClient from '../../../axios/axios';
import LogoGraphic from '../../../graphics/logo.svg';
import { AppDispatch, RootState } from '../../../store';
import { AUTH_URL } from '../../LandingView/forms/RegisterForm';
import { clearDetails } from '../../LandingView/userDetailsSlice';
import viewsRoutes from '../../viewsRoutes';
import { CustomDialog } from '../CustomDialog/CustomDialog';

export const Logo: React.FC = () => {
  const history = useHistory();
  return (
    <Container
      onClick={() => history.push(viewsRoutes.START)}
      sx={{
        cursor: 'pointer',
        backgroundImage: `url(${LogoGraphic})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        height: 95,
        width: 247,
        marginLeft: 2,
        marginRight: 2,
        overflow: 'visible',
        zIndex: 1,
      }}
    />
  );
};

type PrimaryNavBarButtonProps = {
  text: string;
  isChosen: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

export const PrimaryNavBarButton: React.FC<PrimaryNavBarButtonProps> = props => {
  if (props.isChosen)
    return (
      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'customColors.gold',
          height: 60,
          overflow: 'visible',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={props.onClick}
        square
      >
        <Typography
          variant="h6"
          sx={{
            cursor: 'pointer',
            color: 'common.black',
            paddingLeft: 2,
            paddingRight: 2,
            fontWeight: 'bold',
          }}
        >
          {props.text}
        </Typography>
      </Paper>
    );
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'customBackgrounds.gray',
        height: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={props.onClick}
      square
    >
      <Typography
        variant="h6"
        sx={{
          cursor: 'pointer',
          color: 'common.white',
          paddingLeft: 2,
          paddingRight: 2,
          letterSpacing: 0.21,
          fontWeight: 'medium',
        }}
      >
        {props.text}
      </Typography>
    </Paper>
  );
};

type SecondaryNavBarButtonProps = {
  text: string;
  isChosen: boolean;
  isDisplayed: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

export const SecondaryNavBarButton: React.FC<SecondaryNavBarButtonProps> = props => {
  const outerPaperStyle = {
    backgroundColor: 'customBackgrounds.lightGray',
    height: 50,
    display: props.isDisplayed ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
  };
  if (props.isChosen)
    return (
      <Paper elevation={0} sx={outerPaperStyle} onClick={props.onClick} square>
        <Paper
          sx={{
            backgroundColor: 'customColors.gold',
            borderRadius: 5,
            height: 35,
            marginLeft: 1,
            marginRight: 1,
            paddingLeft: 1.5,
            paddingRight: 1.5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              cursor: 'pointer',
              color: 'common.black',
              letterSpacing: -0.15,
              fontWeight: 'bold',
              fontSize: 17,
            }}
          >
            {props.text}
          </Typography>
        </Paper>
      </Paper>
    );
  return (
    <Paper elevation={0} sx={outerPaperStyle} onClick={props.onClick} square>
      <Typography
        variant="h6"
        sx={{
          cursor: 'pointer',
          color: 'common.white',
          paddingLeft: 2.5,
          paddingRight: 2.5,
          fontWeight: 'medium',
          fontSize: 17,
        }}
      >
        {props.text}
      </Typography>
    </Paper>
  );
};

export const UserPanel: React.FC = () => {
  const username = useSelector((state: RootState) => state.user.username);
  const [menuAnchor, setMenuAnchor] = useState<null | Element>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDialogContent, setCurrentDialogContent] = useState<null | string>(null);
  const [avatar, setAvatar] = useState<string>();
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
    setCurrentDialogContent('settings');
    setIsDialogOpen(true);
  };

  const handleAboutClick = () => {
    handleClose();
    setCurrentDialogContent('about');
    setIsDialogOpen(true);
  };

  const handleLogoutClick = async () => {
    handleClose();
    const response = await logout(dispatch);
    if (response.status === 200) history.push(viewsRoutes.LANDING);
    else history.push(viewsRoutes.ERROR);
  };

  useEffect(() => {
    protectedApiClient
      .get('/api/user/image', {
        responseType: 'arraybuffer',
      })
      .then(response => setAvatar(Buffer.from(response.data, 'binary').toString('base64')));
  }, []);

  return (
    <Box sx={{ marginLeft: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'customColors.gold',
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
              backgroundColor: 'customBackgrounds.gray',
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
              // alt should be set to username, but type of username is null...
              alt="Avatar"
              src={`data:;charset=utf-8;base64,${avatar}`}
              sx={{ width: 30.5, height: 30.5, imageRendering: 'crisp-edges' }}
            />
          </Paper>
          {/* <AccountCircle sx={{ color: 'common.black' }} /> */}
          <Typography
            variant="subtitle1"
            sx={{
              color: 'common.black',
              fontWeight: 'bold',
            }}
          >
            {username}
          </Typography>
          <MoreVert
            onClick={handleMoreVertClick}
            sx={{
              color: 'common.black',
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
            backgroundColor: 'customBackgrounds.gray',
          },
        }}
        disableAutoFocusItem
      >
        <MenuItem onClick={handleSettingsClick}>Settings</MenuItem>
        <MenuItem onClick={handleAboutClick}>About</MenuItem>
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </Menu>
      <CustomDialog
        title={'SETTINGS'}
        hasButtons={false}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
      >
        {() => {
          if (currentDialogContent === 'settings')
            return <Typography variant="subtitle1">{'Here will be settings'}</Typography>;
          if (currentDialogContent === 'about')
            return <Typography variant="subtitle1">{'Here will be about'}</Typography>;
          setIsDialogOpen(false);
          return <Typography variant="subtitle1">{'Dialog error'}</Typography>;
        }}
      </CustomDialog>
    </Box>
  );
};

const logout = (dispatch: AppDispatch): Promise<AxiosResponse> => {
  dispatch(clearDetails({}));
  return protectedApiClient.post(`${AUTH_URL}/logout`, {});
};

/*
const AboutContent: React.FC = () => {

}
*/
