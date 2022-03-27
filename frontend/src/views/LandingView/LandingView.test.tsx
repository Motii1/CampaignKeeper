import { fireEvent, screen } from '@testing-library/react';
import { AllProviders, renderWithRouter } from '../../utils/test-utils';
import { LandingView } from './LandingView';

test('renders LandingView', () => {
  renderWithRouter(
    <AllProviders>
      <LandingView />
    </AllProviders>
  );

  expect(screen.getByText('Email or username')).toBeInTheDocument();
  expect(screen.getByText('Password')).toBeInTheDocument();
  expect(screen.getByText('Login')).toBeInTheDocument();
  expect(screen.getByText('Register')).toBeInTheDocument();
});

test('switches from LoginForm to RegisterForm on click', async () => {
  renderWithRouter(
    <AllProviders>
      <LandingView />
    </AllProviders>
  );

  expect(screen.getByText('Register')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Register'));

  // checking if register form is on screen
  expect(screen.getByText('Username')).toBeInTheDocument();
  expect(screen.getByText('Email')).toBeInTheDocument();
  expect(screen.getByText('Repeat email')).toBeInTheDocument();
  expect(screen.getByText('Password')).toBeInTheDocument();
  expect(screen.getByText('Repeat password')).toBeInTheDocument();
  expect(screen.getByText('Register')).toBeInTheDocument();
  expect(screen.getByText('Login')).toBeInTheDocument();

  // checking if login form has been removed from screen
  expect(screen.queryByText('Email or username')).toBeNull();
});

test('switches from RegisterForm to LoginForm on click', async () => {
  renderWithRouter(
    <AllProviders>
      <LandingView />
    </AllProviders>
  );

  // switching to RegisterForm
  expect(screen.getByText('Register')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Register'));

  // switching to LoginForm
  expect(screen.getByText('Login')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Login'));

  // checking if login form is on screen
  expect(screen.getByText('Email or username')).toBeInTheDocument();
  expect(screen.getByText('Password')).toBeInTheDocument();
  expect(screen.getByText('Login')).toBeInTheDocument();
  expect(screen.getByText('Register')).toBeInTheDocument();

  // checking if register form has been removed from screen
  expect(screen.queryByText('Username')).toBeNull();
  expect(screen.queryByText('Email')).toBeNull();
  expect(screen.queryByText('Repeat email')).toBeNull();
  expect(screen.queryByText('Repeat password')).toBeNull();
});
