import { ThemeProvider } from '@emotion/react';
import { useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { Routing } from './Routing/Routing';
import { theme } from './theme/theme';
import { fetchUserDetails } from './views/LandingView/userDetailsSlice';

export const App: React.FC = () => {
  const dispatch = useDispatch();
  dispatch(fetchUserDetails());

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <Routing />
        </ErrorBoundary>
      </ThemeProvider>
    </BrowserRouter>
  );
};
