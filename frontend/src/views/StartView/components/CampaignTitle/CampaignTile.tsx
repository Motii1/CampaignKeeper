import { Box, Paper, Stack, Typography } from '@mui/material';
import CampaignDefaultGraphic from '../../../../graphics/campaignDefault.jpg';

type CampaignTileProps = {
  campaignTitle: string;
};

export const CampaignTile: React.FC<CampaignTileProps> = props => (
  <Paper
    sx={{
      cursor: 'pointer',
      borderRadius: 3,
      backgroundColor: 'customPalette.background',
      maxHeight: '24vh',
      padding: '5px',
    }}
  >
    <Stack direction="column" spacing={0.5}>
      <Box
        component="img"
        alt="Campaign graphic"
        src={CampaignDefaultGraphic}
        sx={{ borderRadius: 3, height: '18vh' }}
      />
      <Typography
        sx={{
          color: 'customPalette.accent',
          fontWeight: 'bold',
          textAlign: 'left',
          padding: '3px',
          paddingLeft: '15px',
        }}
      >
        {props.campaignTitle}
      </Typography>
    </Stack>
  </Paper>
);
