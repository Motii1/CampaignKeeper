import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export const ErrorView: React.FC = () => {
  const { isError, message } = useSelector((state: RootState) => state.errorReducer);
  if (isError) {
    return <h1>{message}</h1>;
  }
  return <h1>{'Sorry, unexpected error has occured'}</h1>;
};
