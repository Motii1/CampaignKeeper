import { Typography } from '@mui/material';

type QuoteLineProps = {
  text: string;
};
// TO-DO: discuss entire quote functionality with rest of the team
// TO-DO: decide if quotes should be fetched from backend or imported
// TO-DO: establish contraints on quote length
export const QuoteLine: React.FC<QuoteLineProps> = props => (
  <Typography
    variant="h6"
    sx={{
      color: 'customPalette.accent',
      fontStyle: 'italic',
      padding: 1,
      paddingTop: 7,
      paddingBottom: 0,
      fontWeight: 'regular',
    }}
  >
    {props.text}
  </Typography>
);
