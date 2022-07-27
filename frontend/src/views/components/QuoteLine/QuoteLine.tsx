import { Box, Typography } from '@mui/material';

type QuoteLineProps = {
  text: string;
};

/**
 * Component used to display popculture quotes in CampaignView and StartView
 * @param props
 * @returns
 */
export const QuoteLine: React.FC<QuoteLineProps> = props => (
  <Box
    component="div"
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 80,
      width: '100%',
    }}
  >
    <Typography
      noWrap
      align="center"
      variant="h6"
      sx={{
        color: 'customPalette.onBackgroundVariant',
        fontStyle: 'italic',
        padding: 1,
        paddingTop: 7,
        paddingBottom: 0,
        height: 55,
        fontWeight: 'regular',
        width: '95%',
      }}
    >
      {props.text}
    </Typography>
  </Box>
);
