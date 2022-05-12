import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { Routing } from './Routing/Routing';
import { darkTheme, lightTheme } from './theme/theme';
import { fetchUserDetails } from './views/LandingView/userDetailsSlice';
import { fetchCampaigns } from './views/StartView/campaignsSlice';

interface IColorModeContext {
  toggleColorMode: () => void;
  mode: 'dark' | 'light';
}

export const ColorModeContext = React.createContext<IColorModeContext>({
  toggleColorMode: () => {
    // do nothing
  },
  mode: 'dark',
});

export const App: React.FC = () => {
  const dispatch = useDispatch();
  dispatch(fetchUserDetails());
  dispatch(fetchCampaigns());

  const [mode, setMode] = React.useState<'light' | 'dark'>('dark');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  const theme = React.useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

  return (
    <BrowserRouter>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <ErrorBoundary>
            <Routing />
          </ErrorBoundary>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </BrowserRouter>
  );
};
