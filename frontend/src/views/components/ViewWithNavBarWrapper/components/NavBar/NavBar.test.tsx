import { cleanup, fireEvent, RenderResult, screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../../utils/test-utils';
import viewsRoutes from '../../../../viewsRoutes';
import { NavBar } from './NavBar';

// function necessary for rendering NavBar
const setMessageMock = (message: string) => {
  // eslint-disable-next-line no-console
  console.log(message);
};

describe('NavBar test', () => {
  let component: RenderResult;

  afterAll(cleanup);

  beforeEach(
    () =>
      (component = renderWithProviders(
        <NavBar
          currentView={viewsRoutes.START}
          setSnackbarInfo={setMessageMock}
          setSnackbarSuccess={setMessageMock}
          setSnackbarError={setMessageMock}
        />
      ))
  );

  afterEach(() => component.unmount());

  describe('buttons tests', () => {
    test('renders logo', () => {
      expect(screen.getByAltText('Logo')).toBeInTheDocument();
    });

    test('renders main buttons', () => {
      expect(screen.getByText('START')).toBeInTheDocument();
      expect(screen.getByText('CAMPAIGN')).toBeInTheDocument();
    });

    test('renders campaign buttons', () => {
      expect(screen.getByText('MAP')).toBeInTheDocument();
      expect(screen.getByText('EXPLORER')).toBeInTheDocument();
      expect(screen.getByText('CODEX')).toBeInTheDocument();
    });
  });

  describe('userPanel tests', () => {
    test('renders UserPanel', async () => {
      expect(screen.getByTestId('MoreVertIcon')).toBeInTheDocument();
    });

    test('opens UserPanel menu', async () => {
      fireEvent.click(screen.getByTestId('MoreVertIcon'));
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    test('opens Settings dialog', async () => {
      fireEvent.click(screen.getByTestId('MoreVertIcon'));
      fireEvent.click(screen.getByText('Settings'));
      expect(screen.getByText('Avatar')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
    });

    test('opens About dialog', async () => {
      fireEvent.click(screen.getByTestId('MoreVertIcon'));
      fireEvent.click(screen.getByText('About'));
      expect(screen.getByText(/Version/)).toBeInTheDocument();
      expect(screen.getByText(/Authors/)).toBeInTheDocument();
    });
  });
});
