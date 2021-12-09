import { Route, Switch } from 'react-router-dom';
import { CampaignView } from '../views/CampaignView/CampaignView';
import { CodexView } from '../views/CodexView/CodexView';
import { ErrorView } from '../views/ErrorView/ErrorView';
import { LandingView } from '../views/LandingView/LandingView';
import { MapView } from '../views/MapView/MapView';
import { NotesView } from '../views/NotesView/NotesView';
import { SessionsView } from '../views/SessionsView/SessionsView';
import viewsRoutes from '../views/viewsRoutes';
import { WelcomeView } from '../views/WelcomeView/WelcomeView';
import { ProtectedRouteWrapper } from './ProtectedRouteWrapper/ProtectedRouteWrapper';
import { RouteWrapper } from './RouteWrapper/RouteWrapper';

export const Routing: React.FC = () => (
  <Switch>
    <ProtectedRouteWrapper path={viewsRoutes.START}>
      <WelcomeView />
    </ProtectedRouteWrapper>
    <ProtectedRouteWrapper path={viewsRoutes.CAMPAIGN}>
      <CampaignView />
    </ProtectedRouteWrapper>
    <ProtectedRouteWrapper path={viewsRoutes.MAP}>
      <MapView />
    </ProtectedRouteWrapper>
    <ProtectedRouteWrapper path={viewsRoutes.SESSIONS}>
      <SessionsView />
    </ProtectedRouteWrapper>
    <ProtectedRouteWrapper path={viewsRoutes.CODEX}>
      <CodexView />
    </ProtectedRouteWrapper>
    <ProtectedRouteWrapper path={viewsRoutes.NOTES}>
      <NotesView />
    </ProtectedRouteWrapper>
    <Route path={viewsRoutes.ERROR}>
      <ErrorView />
    </Route>
    <RouteWrapper path={viewsRoutes.LANDING} exact>
      <LandingView />
    </RouteWrapper>
  </Switch>
);
