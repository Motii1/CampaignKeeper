// TO-DO (very low priority): add graphic to text

import { Typography } from '@mui/material';

type EmptyPlaceholderProps = {
  message: string;
};

export const EmptyPlaceholder: React.FC<EmptyPlaceholderProps> = props => (
  <Typography
    sx={{
      color: 'customPalette.onBackground',
      opacity: 0.8,
      fontSize: 19,
      fontWeight: 'bold',
      textAlign: 'center',
    }}
  >
    {props.message}
  </Typography>
);
