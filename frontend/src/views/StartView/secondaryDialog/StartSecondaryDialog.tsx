import { Box, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { RootState } from '../../../store';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { deleteCampaign } from '../campaignsSlice';
import { resetState } from '../startViewSlice';

type StartSecondaryCustomDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  setIsPrimaryOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

export const StartSecondaryDialog: React.FC<StartSecondaryCustomDialogProps> = props => {
  const dispatch = useDispatch();
  const campaignId = useSelector((state: RootState) => state.startView.id);

  const {
    isLoading: isLoadingDelete,
    status: statusDelete,
    runQuery: runQueryDelete,
    resetQuery: resetQueryDelete,
  } = useQuery(`/api/campaign/${campaignId}`, requestMethods.DELETE);

  const handleRunQueryDelete = useCallback(() => {
    if (!isLoadingDelete && statusDelete) {
      if (statusDelete === 200) {
        dispatch(deleteCampaign({ id: campaignId }));
        dispatch(resetState({}));
        props.setSnackbarSuccess('Campaign deleted');
        props.setIsOpen(false);
        props.setIsPrimaryOpen(false);
      } else if (statusDelete === 400) {
        props.setSnackbarError('Error during campaign deletion');
        props.setIsOpen(false);
      }
      resetQueryDelete();
    }
  }, [campaignId, dispatch, isLoadingDelete, props, resetQueryDelete, statusDelete]);

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
