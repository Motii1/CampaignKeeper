import { Box, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { RootState } from '../../../store';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { resetState } from '../campaignViewSlice';
import { deleteSession } from '../sessionsSlice';

type CampaignSecondaryDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  setIsPrimaryOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

export const CampaignSecondaryDialog: React.FC<CampaignSecondaryDialogProps> = props => {
  const dispatch = useDispatch();
  const sessionId = useSelector((state: RootState) => state.campaignView.sessionId);

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
        dispatch(resetState({}));
        props.setSnackbarSuccess('Session deleted');
        props.setIsOpen(false);
        props.setIsPrimaryOpen(false);
      } else if (statusDelete === 400) {
        props.setSnackbarError('Error during session deletion');
        props.setIsOpen(false);
      }
      resetQueryDelete();
    }
  }, [dispatch, isLoadingDelete, props, resetQueryDelete, sessionId, statusDelete]);

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
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {"This action can't be undone."}
        </Typography>
      </CustomDialog>
    </Box>
  );
};
