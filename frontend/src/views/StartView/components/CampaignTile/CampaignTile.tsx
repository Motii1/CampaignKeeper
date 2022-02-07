import { Box, Paper, Stack, Typography } from '@mui/material';
import CampaignDefaultGraphic from '../../../../graphics/campaignDefault.jpg';

type CampaignTileProps = {
  campaignTitle: string;
};

export const CampaignTile: React.FC<CampaignTileProps> = props => (
  <Paper
    sx={{
      cursor: 'pointer',
      borderRadius: 2.5,
      backgroundColor: 'customPalette.brown',
      height: 211,
      width: 371.2,
      padding: 0.66,
      margin: 1.5,
    }}
  >
    <Stack direction="column" spacing={0.5}>
      <Box
        component="img"
        alt="Campaign graphic"
        src={CampaignDefaultGraphic}
        sx={{
          borderRadius: 2,
          height: 180,
          width: 370,
          objectFit: 'cover',
        }}
      />
      <Typography
        sx={{
          color: 'customPalette.accent',
          fontWeight: 'medium',
          textAlign: 'left',
          paddingLeft: 1.5,
          paddingRight: 1.5,
          paddingTop: 0.3,
        }}
      >
        {props.campaignTitle}
      </Typography>
    </Stack>
  </Paper>
);
