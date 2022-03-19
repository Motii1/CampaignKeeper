import { ThemeProvider } from '@emotion/react';
import { useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { Routing } from './Routing/Routing';
import { theme } from './theme/theme';
import { fetchUserDetails } from './views/LandingView/userDetailsSlice';
import { fetchCampaigns } from './views/StartView/campaignsSlice';

export const App: React.FC = () => {
  const dispatch = useDispatch();
  dispatch(fetchUserDetails());
  dispatch(fetchCampaigns());
  // eslint-disable-next-line no-console
  console.log('App');

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
