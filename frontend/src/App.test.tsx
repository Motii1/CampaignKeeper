import { cleanup, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { App } from './App';
import { store } from './store';

const StoreProviderWrapper: React.FC = props => <Provider store={store}>{props.children}</Provider>;

test('renders learn react link', () => {
  const component = render(
    <StoreProviderWrapper>
      <App />
    </StoreProviderWrapper>
  );

  expect(screen.getByAltText('Logo')).toBeInTheDocument();

  expect(screen.getByText('Email or username')).toBeInTheDocument();
  expect(screen.getByText('Password')).toBeInTheDocument();
  expect(screen.getByText('Login')).toBeInTheDocument();
  expect(screen.getByText('Register')).toBeInTheDocument();

  component.unmount();
  cleanup();
});
