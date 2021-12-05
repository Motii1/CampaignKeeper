import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export const ErrorView: React.FC = () => {
  const errorMessage = useSelector((state: RootState) => state.axiosErrorReducer.message);
  // eslint-disable-next-line no-console
  console.log(errorMessage);
  return <h1>{`Here will be error page(s), message: ${errorMessage}`}</h1>;
};
