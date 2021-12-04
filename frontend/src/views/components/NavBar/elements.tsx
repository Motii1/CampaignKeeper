/* eslint-disable arrow-body-style */
import { AccountCircle, MoreVert } from '@mui/icons-material';
import { Container, Paper, Stack, Typography } from '@mui/material';
import LogoGraphic from '../../../graphics/logo.svg';

export const Logo: React.FC = () => (
  <Container
    sx={{
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

type LogoutProps = {
  username: null | string;
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
        <b>{props.username}</b>
      </Typography>
      <MoreVert onClick={props.onClick} sx={{ color: 'common.black' }} />
    </Stack>
  </Paper>
);
