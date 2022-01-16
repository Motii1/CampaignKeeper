import { Container } from '@mui/material';
import { useHistory } from 'react-router-dom';
import LogoGraphic from '../../../../../graphics/logo.svg';
import viewsRoutes from '../../../../viewsRoutes';

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
