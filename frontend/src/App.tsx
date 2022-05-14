import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { Routing } from './Routing/Routing';
import { RootState } from './store';
import { fetchUserDetails } from './views/LandingView/userDetailsSlice';
import { fetchCampaigns } from './views/StartView/campaignsSlice';

export const App: React.FC = () => {
  const dispatch = useDispatch();

  const { theme } = useSelector((state: RootState) => state.theme);
  dispatch(fetchUserDetails());
  dispatch(fetchCampaigns());

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
