import { Container, Paper, Typography } from '@mui/material';
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
      height: 120,
      marginLeft: 5,
      marginRight: 5,
      overflow: 'visible',
      zIndex: 1,
    }}
  />
);

// START, CAMPAIGN, NOTES
export const BigNavBarButton: React.FC<NavBarButtonProps> = props => {
  if (props.isChosen)
    return (
      <Paper
        elevation={0}
        sx={{ backgroundColor: 'customColors.gold', height: 80, overflow: 'visible', zIndex: 1 }}
        onClick={props.onClick}
        square
      >
        <Typography variant="h5" align="center" sx={{ color: 'common.black', margin: 5 }}>
          {props.text}
        </Typography>
      </Paper>
    );
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'customBackgrounds.lightGray',
        height: 'dimensions.navBarHeight',
        width: 'auto',
      }}
      onClick={props.onClick}
      square
    >
      <Typography variant="h6" align="center" sx={{ color: 'common.white' }}>
        {props.text}
      </Typography>
    </Paper>
  );
};

/*
// MAP, SESSIONS, CODEX
export const SmallNavBarButton = (props: NavBarButtonProps): React.FC => {

} 
*/
