import { Box, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import CampaignDefaultGraphic from '../../../graphics/campaignDefault.jpg';
import { NavBarViewDialog } from '../../../types/types';
import { updateState } from '../../StartView/startViewSlice';
import { EditMenu } from '../EditMenu/EditMenu';

type CampaignTileProps = {
  campaignTitle: string;
  setIsOpen: (newIsOpen: boolean) => void;
  setDialogType: (newDialogType: NavBarViewDialog) => void;
};

//TO-DO this component should take image as one of args -> add after API finished
export const CampaignTile: React.FC<CampaignTileProps> = props => {
  const dispatch = useDispatch();
  const [menuPos, setMenuPos] = useState<null | { mouseX: number; mouseY: number }>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuPos(
      menuPos === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : null
    );
  };

  const handleClose = () => {
    setMenuPos(null);
  };

  const handleEdit = () => {
    dispatch(updateState({ name: props.campaignTitle }));
    props.setIsOpen(true);
    props.setDialogType(NavBarViewDialog.Edit);
    setMenuPos(null);
  };

  return (
    <Paper
      sx={{
        cursor: 'context-menu',
        borderRadius: 2.5,
        backgroundColor: 'customPalette.brown',
        height: 211,
        width: 371.2,
        padding: 0.66,
        margin: 1.5,
      }}
      onContextMenu={handleContextMenu}
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
      <EditMenu menuPos={menuPos} handleEdit={handleEdit} handleClose={handleClose} />
    </Paper>
  );
};
