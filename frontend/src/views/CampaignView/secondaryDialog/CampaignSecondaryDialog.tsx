import { Box, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { RootState } from '../../../store';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { resetState as resetStateExplorer } from '../../ExplorerView/explorerViewSlice';
import { resetState as resetStateMap } from '../../MapView/mapViewSlice';
import { resetState as resetStateCampaign } from '../campaignViewSlice';
import { deleteSession } from '../sessionsSlice';

type CampaignSecondaryDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  setIsPrimaryOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

/**
 * Component used as secondary dialog in CampaignView to ask user
 * for reconfirmation that they want to delete selected session
 * @param props
 * @returns
 */
export const CampaignSecondaryDialog: React.FC<CampaignSecondaryDialogProps> = props => {
  const dispatch = useDispatch();
  const sessionId = useSelector((state: RootState) => state.campaignView.sessionId);
  const sessionIdMapView = useSelector((state: RootState) => state.mapView.currentSessionId);

  const {
    isLoading: isLoadingDelete,
    status: statusDelete,
    runQuery: runQueryDelete,
    resetQuery: resetQueryDelete,
  } = useQuery(`/api/session/${sessionId}`, requestMethods.DELETE);

  const handleRunQueryDelete = useCallback(() => {
    if (!isLoadingDelete && statusDelete) {
      if (statusDelete === 200) {
        dispatch(deleteSession({ id: sessionId }));
        dispatch(resetStateCampaign({}));
        if (sessionId === sessionIdMapView) {
          // eslint-disable-next-line no-console
          console.log('reset');
          dispatch(resetStateMap({}));
          dispatch(resetStateExplorer({}));
        }
        props.setSnackbarSuccess('Session deleted');
        props.setIsOpen(false);
        props.setIsPrimaryOpen(false);
      } else if (statusDelete === 400) {
        props.setSnackbarError('Error during session deletion');
        props.setIsOpen(false);
      }
      resetQueryDelete();
    }
  }, [
    dispatch,
    isLoadingDelete,
    props,
    resetQueryDelete,
    sessionId,
    sessionIdMapView,
    statusDelete,
  ]);

  useEffect(() => {
    handleRunQueryDelete();
  }, [handleRunQueryDelete]);

  const handleOk = () => {
    runQueryDelete();
  };

  const handleCancel = () => {
    props.setIsOpen(false);
  };

  return (
    <Box>
      <CustomDialog
        title={'Are you sure?'}
        isOpen={props.isOpen}
        setIsOpen={props.setIsOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Typography variant="h6" sx={{ color: 'customPalette.onSurface', fontWeight: 'bold' }}>
          {"This action can't be undone."}
        </Typography>
      </CustomDialog>
    </Box>
  );
};
