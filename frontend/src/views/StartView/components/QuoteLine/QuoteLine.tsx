import { Typography } from '@mui/material';

type QuoteLineProps = {
  text: string;
};

export const QuoteLine: React.FC<QuoteLineProps> = props => (
  <Typography
    variant="h6"
    sx={{
      color: 'customPalette.accent',
      fontStyle: 'italic',
      padding: 1,
      paddingTop: 6,
      fontWeight: 'regular',
    }}
  >
    {props.text}
  </Typography>
);
