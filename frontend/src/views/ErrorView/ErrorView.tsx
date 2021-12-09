import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ViewWithSidebarWrapper } from '../components/ViewWithSidebarWrapper/ViewWithSidebarWrapper';

export const ErrorView: React.FC = () => {
  const { isError, message } = useSelector((state: RootState) => state.errorReducer);
  const messageForView = isError ? message : 'Unexpected error';

  return (
    <ViewWithSidebarWrapper>
      <Typography
        variant="h4"
        sx={{ color: 'common.white', fontWeight: 'medium', textAlign: 'center', paddingY: 1 }}
      >
        {`Error: ${messageForView}`}
      </Typography>
    </ViewWithSidebarWrapper>
  );
};
