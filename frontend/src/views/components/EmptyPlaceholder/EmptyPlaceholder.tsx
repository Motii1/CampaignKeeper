import { Box, Typography } from '@mui/material';

type EmptyPlaceholderProps = {
  message: string;
};

/**
 * Generic component shown when there is no content to be shown
 * (e.g. user opened CampaignView and hasn't created any campaigns as of yet),
 * displays text message passed from parent
 * NOTE: in the future it would be nice to add custom graphics
 * to every usage of this component (e.g. a planet forming out of empty space in CampaignView)
 * @param props
 * @returns
 */
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
