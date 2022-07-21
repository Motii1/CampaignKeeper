import { Box, Typography } from '@mui/material';

type EmptyPlaceholderProps = {
  message: string;
};

// TO-DO (very low priority): add graphic to text
export const EmptyPlaceholder: React.FC<EmptyPlaceholderProps> = props => (
  <Box
    sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
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
  </Box>
);
