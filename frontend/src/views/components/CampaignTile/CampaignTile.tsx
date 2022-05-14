import { Box, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { NavBarViewDialog } from '../../../types/types';
import { updateSelectedCampaignData } from '../../CampaignView/campaignViewSlice';
import { updateState as updateStateStart } from '../../StartView/startViewSlice';
import viewsRoutes from '../../viewsRoutes';
import { EditMenu } from '../EditMenu/EditMenu';

type CampaignTileProps = {
  campaignId: string;
  campaignName: string;
  campaignImageBase64: string;
  setIsOpen: (newIsOpen: boolean) => void;
  setDialogType: (newDialogType: NavBarViewDialog) => void;
  isClickable?: boolean;
};

export const CampaignTile: React.FC<CampaignTileProps> = props => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [menuPos, setMenuPos] = useState<null | { mouseX: number; mouseY: number }>(null);

  const handleClick = () => {
    if (props.isClickable) {
      dispatch(
        updateSelectedCampaignData({
          campaignId: props.campaignId,
          campaignName: props.campaignName,
          campaignImageBase64: props.campaignImageBase64,
        })
      );
      history.push(viewsRoutes.CAMPAIGN);
    }
  };

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

  const handleEdit = () => {
    dispatch(
      updateStateStart({
        id: props.campaignId,
        name: props.campaignName,
        imageBase64: props.campaignImageBase64,
      })
    );
    props.setIsOpen(true);
    props.setDialogType(NavBarViewDialog.EditCampaign);
    setMenuPos(null);
  };

  const handleClose = () => {
    setMenuPos(null);
  };

  const cursorType = props.isClickable ? 'pointer' : 'default';
  return (
    <Paper
      sx={{
        cursor: cursorType,
        borderRadius: 2.5,
        backgroundColor: 'customPalette.brown',
        height: { xs: 147.7, lg: 211 },
        width: { xs: 259.8, lg: 371.2 },
        padding: 0.66,
        margin: 2,
      }}
      onContextMenu={handleContextMenu}
    >
      <Stack direction="column" spacing={0.5} onClick={handleClick}>
        <Box
          component="img"
          alt="Campaign graphic"
          src={`data:;charset=utf-8;base64,${props.campaignImageBase64}`}
          sx={{
            borderRadius: 2,
            height: { xs: 126, lg: 180 },
            width: { xs: 259, lg: 370 },
            objectFit: 'cover',
          }}
        />
        <Typography
          sx={{
            color: 'customPalette.onBrown',
            fontWeight: 'medium',
            textAlign: 'left',
            paddingLeft: { xs: 0.7, lg: 1.5 },
            paddingRight: { xs: 0.7, lg: 1.5 },
            paddingTop: { xs: 0, lg: 0.3 },
            fontSize: { xs: 13, lg: 16 },
          }}
        >
          {props.campaignName}
        </Typography>
      </Stack>
      {props.isClickable ? (
        <EditMenu menuPos={menuPos} handleEdit={handleEdit} handleClose={handleClose} />
      ) : null}
    </Paper>
  );
};
