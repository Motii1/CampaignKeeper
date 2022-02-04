import { Fab } from '@mui/material';
import React from 'react';
import { StartFabContent } from '../../../../StartView/fab/StartFabContent';
import viewsRoutes from '../../../../viewsRoutes';

type CustomFabProps = {
  currentView: string;
  text?: string;
};

export const CustomFab: React.FC<CustomFabProps> = props => {
  const renderFabContent = () => {
    switch (props.currentView) {
      case viewsRoutes.START:
        return <StartFabContent />;
      default:
        return <StartFabContent />;
    }
  };

  return (
    <Fab
      variant="extended"
      sx={{
        color: 'customPalette.onAccent',
        backgroundColor: 'customPalette.accent',
        position: 'absolute',
        bottom: '2vh',
        right: '2vh',
        '&.MuiButtonBase-root:hover': {
          bgcolor: 'customPalette.accent',
        },
      }}
    >
      {renderFabContent()}
    </Fab>
  );
};
