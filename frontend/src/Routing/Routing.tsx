import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CampaignView } from '../views/CampaignView/CampaignView';
import { CodexView } from '../views/CodexView/CodexView';
import { ErrorView } from '../views/ErrorView/ErrorView';
import { LandingView } from '../views/LandingView/LandingView';
import { LogoutView } from '../views/LogoutView/LogoutView';
import { MapView } from '../views/MapView/MapView';
import { NotesView } from '../views/NotesView/NotesView';
import { SessionsView } from '../views/SessionsView/SessionsView';
import { WelcomeView } from '../views/WelcomeView/WelcomeView';

export const Routing: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LandingView} />
      <Route exact path="/welcome" component={WelcomeView} />
      <Route exact path="/campaign" component={CampaignView} />
      <Route exact path="/map" component={MapView} />
      <Route exact path="/sessions" component={SessionsView} />
      <Route exact path="/codex" component={CodexView} />
      <Route exact path="/notes" component={NotesView} />
      <Route exact path="/logout" component={LogoutView} />
      <Route exact path="/error" component={ErrorView} />
    </Switch>
  </BrowserRouter>
);
