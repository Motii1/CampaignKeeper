import { Route, Switch } from 'react-router-dom';
import { LoginView } from '../views/LoginView/LoginView';
import { RegisterView } from '../views/RegisterView/LoginView';

export const Routing: React.FC = () => (
  <Switch>
    <Route exact path="/">
      <LoginView />
    </Route>
    <Route exact path="/register">
      <RegisterView />
    </Route>
  </Switch>
);
