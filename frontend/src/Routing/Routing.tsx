import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { LandingView } from '../views/LandingView/LandingView';

export const Routing: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/">
        <LandingView />
      </Route>
    </Switch>
  </BrowserRouter>
);
