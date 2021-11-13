import { useHistory } from 'react-router';
import { RootState } from './store';

type ErrorProps = {
  store: RootState;
  component: React.FC;
};

export const ErrorWrapper: React.FC<ErrorProps> = props => {
  const history = useHistory();
  if (props.store.errors.value) history.push('/error');

  return props.component;
};
