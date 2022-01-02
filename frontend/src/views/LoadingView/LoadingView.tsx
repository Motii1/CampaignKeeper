import { CircularProgress, Stack } from '@mui/material';
import { ViewWithSidebarWrapper } from '../components/ViewWithSidebarWrapper/ViewWithSidebarWrapper';

export const LoadingView: React.FC = () => (
  <ViewWithSidebarWrapper>
    <Stack justifyContent="center" alignItems="center">
      <CircularProgress size={100} sx={{ color: 'customColors.gold', margin: '10px' }} />
    </Stack>
  </ViewWithSidebarWrapper>
);
