import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { store } from '../../store';
import { ViewWithSidebarWrapper } from '../components/ViewWithSidebarWrapper/ViewWithSidebarWrapper';
import { clearError } from './errorSlice';

export const ErrorView: React.FC = () => {
  const { isError, message } = store.getState().error;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <ViewWithSidebarWrapper>
      <Typography
        variant="h4"
        sx={{ color: 'common.white', fontWeight: 'medium', textAlign: 'center', paddingY: 1 }}
      >
        {`Error: ${isError ? message : 'Unexpected error'}`}
      </Typography>
    </ViewWithSidebarWrapper>
  );
};
