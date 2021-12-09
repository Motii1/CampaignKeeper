import { BackgroundGraphic, Sidebar, SidebarPaper, SidebarViewGrid } from './elements';

export const ViewWithSidebarWrapper: React.FC = props => (
  <SidebarViewGrid>
    <Sidebar>
      <SidebarPaper>{props.children}</SidebarPaper>
    </Sidebar>
    <BackgroundGraphic />
  </SidebarViewGrid>
);
