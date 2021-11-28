import { AccountCircle, MoreVert } from '@mui/icons-material';
import { Container, Paper, Stack, Typography } from '@mui/material';
import LogoGraphic from '../../../graphics/logo.svg';

type NavBarButtonProps = {
  text: string;
  isChosen: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

export const Logo: React.FC = () => (
  <Container
    sx={{
      backgroundImage: `url(${LogoGraphic})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      height: 100,
      width: 260,
      marginLeft: 2,
      marginRight: 2,
      overflow: 'visible',
      zIndex: 1,
    }}
  />
);

export const BigNavBarButton: React.FC<NavBarButtonProps> = props => {
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
          variant="h5"
          sx={{ cursor: 'pointer', color: 'common.black', paddingLeft: 3, paddingRight: 3 }}
        >
          <b>{props.text}</b>
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
        sx={{ cursor: 'pointer', color: 'common.white', paddingLeft: 2, paddingRight: 2 }}
      >
        <b>{props.text}</b>
      </Typography>
    </Paper>
  );
};

/*
// MAP, SESSIONS, CODEX
export const SmallNavBarButton = (props: NavBarButtonProps): React.FC => {

} 
*/

type LogoutProps = {
  onClick: (event: React.MouseEvent<SVGSVGElement>) => void;
};

export const LogoutPanel: React.FC<LogoutProps> = props => (
  <Paper
    elevation={0}
    sx={{
      backgroundColor: 'customColors.gold',
      height: 50,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingLeft: 1,
      paddingRight: 1,
      marginLeft: 'auto',
    }}
    square
  >
    <Stack direction="row" spacing={1} justifyContent="flex-start" alignItems="flex-start">
      <AccountCircle sx={{ color: 'common.black' }} />
      <Typography variant="subtitle1" sx={{ color: 'common.black' }}>
        <b>{'PhenoilGray2137'}</b>
      </Typography>
      <MoreVert onClick={props.onClick} sx={{ color: 'common.black' }} />
    </Stack>
  </Paper>
);
