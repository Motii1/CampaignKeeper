import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { App } from './App';
import { store } from './store';

const StoreProviderWrapper: React.FC = props => <Provider store={store}>{props.children}</Provider>;

test('renders learn react link', () => {
  const { getByText } = render(
    <StoreProviderWrapper>
      <App />
    </StoreProviderWrapper>
  );

  expect(getByText('Email or username')).toBeInTheDocument();
  expect(getByText('Password')).toBeInTheDocument();
  expect(getByText('Login')).toBeInTheDocument();
  expect(getByText('Register')).toBeInTheDocument();
});
