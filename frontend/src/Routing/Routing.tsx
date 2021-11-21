import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ErrorView } from '../views/ErrorView/ErrorView';
import { LandingView } from '../views/LandingView/LandingView';
import { WelcomeView } from '../views/WelcomeView/WelcomeView';

export const Routing: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LandingView} />
      <Route exact path="/welcome" component={WelcomeView} />
      <Route exact path="/error" component={ErrorView} />
    </Switch>
  </BrowserRouter>
);
