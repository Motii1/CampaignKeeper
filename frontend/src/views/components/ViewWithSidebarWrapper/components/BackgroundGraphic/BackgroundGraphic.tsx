import { Grid } from '@mui/material';
import WorldImage from '../../../../../graphics/world.jpg';

/**
 * Background graphic for ViewWithSidebarWrapper
 */
export const BackgroundGraphic: React.FC = () => (
  <Grid
    item
    lg={9}
    md={8}
    sm={6}
    xs={false}
    sx={{
      backgroundImage: `url(${WorldImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  />
);
