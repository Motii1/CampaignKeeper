import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ViewWithSidebarWrapper } from '../components/ViewWithSidebarWrapper/ViewWithSidebarWrapper';
import { clearError } from './errorSlice';

export const ErrorView: React.FC = () => {
  const { message } = useSelector((state: RootState) => state.errorReducer);
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
        {`Error: ${message}`}
      </Typography>
    </ViewWithSidebarWrapper>
  );
};
