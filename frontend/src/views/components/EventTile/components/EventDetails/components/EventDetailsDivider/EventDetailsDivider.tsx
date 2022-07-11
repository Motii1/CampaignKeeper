import { Divider } from '@mui/material';

export const EventDetailsDivider: React.FC = () => (
  <Divider
    variant="middle"
    sx={{
      borderTop: 'white',
      '& .MuiDivider-root': {
        borderTop: 'white',
      },
    }}
  />
);
