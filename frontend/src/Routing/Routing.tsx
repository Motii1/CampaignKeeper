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
import { ProtectedAxiosRoute } from './ProtectedAxiosRoute/ProtectedAxiosRoute';

export const Routing: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <AxiosRoute path={viewsRoutes.LANDING}>
        <LandingView />
      </AxiosRoute>
      <ProtectedAxiosRoute path={viewsRoutes.START}>
        <WelcomeView />
      </ProtectedAxiosRoute>
      <ProtectedAxiosRoute path={viewsRoutes.CAMPAIGN}>
        <CampaignView />
      </ProtectedAxiosRoute>
      <ProtectedAxiosRoute path={viewsRoutes.MAP}>
        <MapView />
      </ProtectedAxiosRoute>
      <ProtectedAxiosRoute path={viewsRoutes.SESSIONS}>
        <SessionsView />
      </ProtectedAxiosRoute>
      <ProtectedAxiosRoute path={viewsRoutes.CODEX}>
        <CodexView />
      </ProtectedAxiosRoute>
      <ProtectedAxiosRoute path={viewsRoutes.NOTES}>
        <NotesView />
      </ProtectedAxiosRoute>
      <AxiosRoute path={viewsRoutes.ERROR}>
        <ErrorView />
      </AxiosRoute>
      <Route exact component={ErrorView} />
    </Switch>
  </BrowserRouter>
);
