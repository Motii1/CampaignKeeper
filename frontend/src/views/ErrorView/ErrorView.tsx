import { Paper, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { store } from '../../store';
import { ViewWithSidebarWrapper } from '../components/ViewWithSidebarWrapper/ViewWithSidebarWrapper';
import { clearError } from './errorSlice';

/**
 * Component shown in error boundary
 * @returns
 */
export const ErrorView: React.FC = () => {
  const { isError, message } = store.getState().error;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError({}));
  }, [dispatch]);

  return (
    <ViewWithSidebarWrapper>
      <Paper
        sx={{
          mx: 2,
          my: 1,
          borderRadius: 3,
          backgroundColor: 'customPalette.error',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: 'customPalette.red',
            fontWeight: 'regular',
            textAlign: 'center',
            paddingY: 1,
          }}
        >
          {isError ? message : 'Unexpected error'}
        </Typography>
      </Paper>
    </ViewWithSidebarWrapper>
  );
};
