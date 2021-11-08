import { render } from '@testing-library/react';
import { App } from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);

  expect(getByText('LOGIN')).toBeInTheDocument();
  expect(getByText('Username')).toBeInTheDocument();
  expect(getByText('Password')).toBeInTheDocument();
  expect(getByText('Register')).toBeInTheDocument();
});
