import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CampaignView } from '../views/CampaignView/CampaignView';
import { CodexView } from '../views/CodexView/CodexView';
import { ErrorView } from '../views/ErrorView/ErrorView';
import { LandingView } from '../views/LandingView/LandingView';
import { MapView } from '../views/MapView/MapView';
import { NotesView } from '../views/NotesView/NotesView';
import { SessionsView } from '../views/SessionsView/SessionsView';
import viewsRoutes from '../views/viewsRoutes';
import { WelcomeView } from '../views/WelcomeView/WelcomeView';
import { AxiosRoute } from './AxiosRoute/AxiosRoute';
// import { ProtectedAxiosRoute } from './AxiosRoute/AxiosRoute';

export const Routing: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <AxiosRoute path={viewsRoutes.LANDING}>
        <LandingView />
      </AxiosRoute>
      <AxiosRoute path={viewsRoutes.START}>
        <WelcomeView />
      </AxiosRoute>
      <AxiosRoute path={viewsRoutes.CAMPAIGN}>
        <CampaignView />
      </AxiosRoute>
      <AxiosRoute path={viewsRoutes.MAP}>
        <MapView />
      </AxiosRoute>
      <AxiosRoute path={viewsRoutes.SESSIONS}>
        <SessionsView />
      </AxiosRoute>
      <AxiosRoute path={viewsRoutes.CODEX}>
        <CodexView />
      </AxiosRoute>
      <AxiosRoute path={viewsRoutes.NOTES}>
        <NotesView />
      </AxiosRoute>
      <AxiosRoute path={viewsRoutes.ERROR}>
        <ErrorView />
      </AxiosRoute>
      <Route exact component={ErrorView} />
    </Switch>
  </BrowserRouter>
);
