import { Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import LogoGraphic from '../../../../../../../graphics/logo.svg';
import viewsRoutes from '../../../../../../viewsRoutes';

export const NavBarLogo: React.FC = () => {
  const history = useHistory();
  return (
    <Box
      onClick={() => history.push(viewsRoutes.START)}
      component="img"
      alt="Logo"
      src={LogoGraphic}
      sx={{
        cursor: 'pointer',
        height: 95,
        width: 247,
        minWidth: 247,
        marginLeft: 2,
        marginRight: 2,
        overflow: 'visible',
        zIndex: 1,
      }}
    />
  );
};
