import { Fab } from '@mui/material';
import React from 'react';
import { CampaignFabContet } from '../../../../CampaignView/fab/CampaignFabContent';
import { CodexFabContent } from '../../../../CodexView/fab/CodexFabContent';
import { MapFabContent } from '../../../../MapView/fab/MapFabContent';
import { StartFabContent } from '../../../../StartView/fab/StartFabContent';
import viewsRoutes from '../../../../viewsRoutes';

type CustomFabProps = {
  currentView: string;
  text?: string;
  handleClick: () => void;
};

export const CustomFab: React.FC<CustomFabProps> = props => {
  const renderFabContent = () => {
    switch (props.currentView) {
      case viewsRoutes.START:
        return <StartFabContent />;
      case viewsRoutes.CAMPAIGN:
        return <CampaignFabContet />;
      case viewsRoutes.CODEX:
        return <CodexFabContent />;
      case viewsRoutes.MAP:
        return <MapFabContent />;
      default:
        return <StartFabContent />;
    }
  };

  return (
    <Fab
      variant="extended"
      aria-label="custom-fab"
      onClick={props.handleClick}
      sx={{
        color: 'customPalette.onAccent',
        backgroundColor: 'customPalette.accent',
        boxShadow: '0px 0px 15px -9px rgba(66, 68, 90, 1)',
        position: 'fixed',
        bottom: 20,
        right: 20,
        '&.MuiButtonBase-root:hover': {
          bgcolor: 'customPalette.accent',
        },
        '&.MuiFab-extended:focus': {
          boxShadow: '0px 0px 15px -9px rgba(66, 68, 90, 1)',
        },
      }}
    >
      {renderFabContent()}
    </Fab>
  );
};
