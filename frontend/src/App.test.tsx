import { cleanup, screen } from '@testing-library/react';
import { App } from './App';
import { renderWithProviders } from './utils/test-utils';

describe('App tests', () => {
  test('renders learn react link', () => {
    const component = renderWithProviders(<App />);

    expect(screen.getByAltText('Logo')).toBeInTheDocument();

    expect(screen.getByText('Email or username')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();

    component.unmount();
    cleanup();
  });
});
