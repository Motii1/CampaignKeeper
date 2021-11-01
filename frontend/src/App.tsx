import { ThemeProvider } from '@emotion/react';
import { Provider } from 'react-redux';
import { Routing } from './Routing/Routing';
import { store } from './store';
import { theme } from './theme/theme';

export const App: React.FC = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Routing />
    </ThemeProvider>
  </Provider>
);
