import { ThemeProvider } from '@emotion/react';
import { render, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../store';
import { darkTheme } from '../theme/theme';

/**
 * Used to provide store during testing components
 * outside of standard application (when provider isn't part of components tree)
 * @param props
 * @returns
 */
export const CustomStoreProvider: React.FC = props => (
  <Provider store={store}>{props.children}</Provider>
);

/**
 * Used to provide store, route browser and theme during testing components
 * outside of standard application (when providers aren't part of components tree)
 * @param props
 * @returns
 */
export const AllProviders: React.FC = props => (
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>{props.children}</ThemeProvider>
    </Provider>
  </BrowserRouter>
);

/**
 * Method used to render components during testing,
 * to provide them with correct route
 * @param ui
 * @param param1
 * @returns
 */
export const renderWithProviders = (ui: React.ReactElement, { route = '/' } = {}): RenderResult => {
  window.history.pushState({}, 'Test page', route);

  return render(ui, { wrapper: AllProviders });
};
