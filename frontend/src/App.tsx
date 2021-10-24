import { Provider } from 'react-redux';
import { Routing } from './Routing/Routing';
import { store } from './store';

export const App: React.FC = () => (
  <Provider store={store}>
    <Routing />
  </Provider>
);
