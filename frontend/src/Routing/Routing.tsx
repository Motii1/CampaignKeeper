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
import { ProtectedRoute } from './ProtectedRoute/ProtectedRoute';

export const Routing: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={viewsRoutes.LANDING} component={LandingView} />
      <ProtectedRoute path={viewsRoutes.START}>
        <WelcomeView />
      </ProtectedRoute>
      <ProtectedRoute path={viewsRoutes.CAMPAIGN}>
        <CampaignView />
      </ProtectedRoute>
      <ProtectedRoute path={viewsRoutes.MAP}>
        <MapView />
      </ProtectedRoute>
      <ProtectedRoute path={viewsRoutes.SESSIONS}>
        <SessionsView />
      </ProtectedRoute>
      <ProtectedRoute path={viewsRoutes.CODEX}>
        <CodexView />
      </ProtectedRoute>
      <ProtectedRoute path={viewsRoutes.NOTES}>
        <NotesView />
      </ProtectedRoute>
      <Route exact path={viewsRoutes.ERROR} component={ErrorView} />
      <Route exact component={ErrorView} />
    </Switch>
  </BrowserRouter>
);
