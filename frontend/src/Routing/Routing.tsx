import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CampaignView } from '../views/CampaignView/CampaignView';
import { CodexView } from '../views/CodexView/CodexView';
import { ErrorView } from '../views/ErrorView/ErrorView';
import { LandingView } from '../views/LandingView/LandingView';
import { LogoutView } from '../views/LogoutView/LogoutView';
import { MapView } from '../views/MapView/MapView';
import { NotesView } from '../views/NotesView/NotesView';
import { SessionsView } from '../views/SessionsView/SessionsView';
import viewsRoutes from '../views/viewsRoutes';
import { WelcomeView } from '../views/WelcomeView/WelcomeView';

export const Routing: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={viewsRoutes.LANDING} component={LandingView} />
      <Route exact path={viewsRoutes.START} component={WelcomeView} />
      <Route exact path={viewsRoutes.CAMPAIGN} component={CampaignView} />
      <Route exact path={viewsRoutes.MAP} component={MapView} />
      <Route exact path={viewsRoutes.SESSIONS} component={SessionsView} />
      <Route exact path={viewsRoutes.CODEX} component={CodexView} />
      <Route exact path={viewsRoutes.NOTES} component={NotesView} />
      <Route exact path={viewsRoutes.LOGOUT} component={LogoutView} />
      <Route exact path={viewsRoutes.ERROR} component={ErrorView} />
    </Switch>
  </BrowserRouter>
);
