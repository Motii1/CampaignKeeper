import { ThemeProvider } from '@emotion/react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { Routing } from './Routing/Routing';
import { theme } from './theme/theme';

export const App: React.FC = () => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <Routing />
      </ErrorBoundary>
    </ThemeProvider>
  </BrowserRouter>
);
