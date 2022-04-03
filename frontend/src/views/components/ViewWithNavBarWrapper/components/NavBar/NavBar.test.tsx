import { cleanup, screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../../utils/test-utils';
import viewsRoutes from '../../../../viewsRoutes';
import { NavBar } from './NavBar';

// function necessary for rendering NavBar
const setMessageMock = (message: string) => {
  // eslint-disable-next-line no-console
  console.log(message);
};

afterAll(cleanup);

test('renders main buttons', () => {
  const component = renderWithProviders(
    <NavBar
      currentView={viewsRoutes.START}
      setSnackbarInfo={setMessageMock}
      setSnackbarSuccess={setMessageMock}
      setSnackbarError={setMessageMock}
    />
  );

  expect(screen.getByAltText('Logo')).toBeInTheDocument();

  expect(screen.getByText('START')).toBeInTheDocument();
  expect(screen.getByText('CAMPAIGN')).toBeInTheDocument();
  expect(screen.getByText('NOTES')).toBeInTheDocument();

  component.unmount();
});

test('renders campaign buttons', () => {
  const component = renderWithProviders(
    <NavBar
      currentView={viewsRoutes.CAMPAIGN}
      setSnackbarInfo={setMessageMock}
      setSnackbarSuccess={setMessageMock}
      setSnackbarError={setMessageMock}
    />
  );

  expect(screen.getByAltText('Logo')).toBeInTheDocument();

  expect(screen.getByText('MAP')).toBeInTheDocument();
  expect(screen.getByText('EXPLORER')).toBeInTheDocument();
  expect(screen.getByText('CODEX')).toBeInTheDocument();

  component.unmount();
});

test('renders UserPanel', async () => {
  const component = renderWithProviders(
    <NavBar
      currentView={viewsRoutes.START}
      setSnackbarInfo={setMessageMock}
      setSnackbarSuccess={setMessageMock}
      setSnackbarError={setMessageMock}
    />
  );

  expect(screen.getByTestId('MoreVertIcon')).toBeInTheDocument();

  component.unmount();
});
