import { Grid } from '@mui/material';
import { BackgroundGraphic } from './components/BackgroundGraphic/BackgroundGraphic';
import { Sidebar } from './components/Sidebar/Sidebar';

/**
 * Component serving as wrapper for all views using sidebar
 * (landing - login&register - view and error view),
 * contains big graphic and smaller sidebar in which all revelevant
 * informations/forms are displayed/rendered
 * @param props
 * @returns
 */
export const ViewWithSidebarWrapper: React.FC = props => (
  <Grid container wrap="nowrap" sx={{ minHeight: '100vh' }}>
    <Sidebar>{props.children}</Sidebar>
    <BackgroundGraphic />
  </Grid>
);
