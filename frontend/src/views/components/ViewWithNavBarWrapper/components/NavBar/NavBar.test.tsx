import { cleanup, fireEvent, screen } from '@testing-library/react';
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

test('opens UserPanel menu', async () => {
  const component = renderWithProviders(
    <NavBar
      currentView={viewsRoutes.START}
      setSnackbarInfo={setMessageMock}
      setSnackbarSuccess={setMessageMock}
      setSnackbarError={setMessageMock}
    />
  );

  fireEvent.click(screen.getByTestId('MoreVertIcon'));
  expect(screen.getByText('Settings')).toBeInTheDocument();
  expect(screen.getByText('About')).toBeInTheDocument();
  expect(screen.getByText('Logout')).toBeInTheDocument();

  component.unmount();
});

test('opens Settings dialog', async () => {
  const component = renderWithProviders(
    <NavBar
      currentView={viewsRoutes.START}
      setSnackbarInfo={setMessageMock}
      setSnackbarSuccess={setMessageMock}
      setSnackbarError={setMessageMock}
    />
  );

  fireEvent.click(screen.getByTestId('MoreVertIcon'));
  fireEvent.click(screen.getByText('Settings'));
  expect(screen.getByText('AVATAR')).toBeInTheDocument();
  expect(screen.getByText('PASSWORD')).toBeInTheDocument();

  component.unmount();
});

test('opens About dialog', async () => {
  const component = renderWithProviders(
    <NavBar
      currentView={viewsRoutes.START}
      setSnackbarInfo={setMessageMock}
      setSnackbarSuccess={setMessageMock}
      setSnackbarError={setMessageMock}
    />
  );

  fireEvent.click(screen.getByTestId('MoreVertIcon'));
  fireEvent.click(screen.getByText('About'));
  expect(screen.getByText(/Version/)).toBeInTheDocument();
  expect(screen.getByText(/Authors/)).toBeInTheDocument();

  component.unmount();
});
