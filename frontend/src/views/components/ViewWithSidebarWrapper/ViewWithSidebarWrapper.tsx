import { Grid } from '@mui/material';
import { BackgroundGraphic } from './components/BackgroundGraphic/BackgroundGraphic';
import { Sidebar } from './components/Sidebar/Sidebar';
import { SidebarPaper } from './components/SidebarPaper/SidebarPaper';

export const ViewWithSidebarWrapper: React.FC = props => (
  <Grid container wrap="nowrap" sx={{ minHeight: '100vh' }}>
    <Sidebar>
      <SidebarPaper>{props.children}</SidebarPaper>
    </Sidebar>
    <BackgroundGraphic />
  </Grid>
);
