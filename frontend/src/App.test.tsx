import { render } from '@testing-library/react';
import { App } from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);

  expect(getByText('Email or username')).toBeInTheDocument();
  expect(getByText('Password')).toBeInTheDocument();
  expect(getByText('Login')).toBeInTheDocument();
  expect(getByText('Register')).toBeInTheDocument();
});
