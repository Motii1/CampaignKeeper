import { Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import LogoGraphic from '../../../../../../../graphics/logo.svg';
import viewsRoutes from '../../../../../../viewsRoutes';

/**
 * Campaign Keeper logo displayed in sidebar,
 * moves to '/' (landing page) on click
 * @returns
 */
export const SidebarLogo: React.FC = () => {
  const history = useHistory();

  const handleClick = () => {
    history.push(viewsRoutes.LANDING);
  };

  return (
    <Box
      component="img"
      onClick={handleClick}
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
