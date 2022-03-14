import { Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import LogoGraphic from '../../../../../../../graphics/logo.svg';
import viewsRoutes from '../../../../../../viewsRoutes';

export const SidebarLogo: React.FC = () => {
  const history = useHistory();
  return (
    <Box
      component="img"
      onClick={() => {
        history.push(viewsRoutes.LANDING);
      }}
      sx={{
        cursor: 'pointer',
        height: 114,
        marginTop: -7.5,
        width: '100%',
      }}
      alt="Logo"
      src={LogoGraphic}
    />
  );
};
