import { ThemeProvider } from '@emotion/react';
import { render, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../store';
import { darkTheme } from '../theme/theme';

export const CustomStoreProvider: React.FC = props => (
  <Provider store={store}>{props.children}</Provider>
);

export const CustomThemeProvider: React.FC = props => (
  <ThemeProvider theme={darkTheme}>{props.children}</ThemeProvider>
);

export const AllProviders: React.FC = props => (
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>{props.children}</ThemeProvider>
    </Provider>
  </BrowserRouter>
);

export const renderWithProviders = (ui: React.ReactElement, { route = '/' } = {}): RenderResult => {
  window.history.pushState({}, 'Test page', route);

  return render(ui, { wrapper: AllProviders });
};
