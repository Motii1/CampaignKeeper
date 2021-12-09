import { ThemeProvider } from '@emotion/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { Routing } from './Routing/Routing';
import { store } from './store';
import { theme } from './theme/theme';

export const App: React.FC = () => (
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <Routing />
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
);
