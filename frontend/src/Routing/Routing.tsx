import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { LandingView } from '../views/LandingView/LandingView';
import { WelcomeView } from '../views/WelcomeView/WelcomeView';

export const Routing: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/">
        <LandingView />
      </Route>
      <Route exact path="/welcome">
        <WelcomeView />
      </Route>
    </Switch>
  </BrowserRouter>
);
