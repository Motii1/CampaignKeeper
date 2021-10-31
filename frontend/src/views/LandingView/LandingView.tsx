import { FormPaper, LandingGraphic, LandingGrid, Sidebar } from './elements';

export const LandingView: React.FC = () => (
  <LandingGrid>
    <Sidebar>
      <FormPaper>Lorem ipsum</FormPaper>
    </Sidebar>
    <LandingGraphic />
  </LandingGrid>
);
