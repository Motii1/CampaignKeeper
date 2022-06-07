import { Box, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { RootState } from '../../../store';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { deleteEntry } from '../codexSlice';
import { setCurrentEntry } from '../codexViewSlice';

type CodexSecondaryDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  setIsPrimaryOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

export const CodexSecondaryDialog: React.FC<CodexSecondaryDialogProps> = props => {
  const dispatch = useDispatch();
  const { currentSchema, currentEntry } = useSelector((state: RootState) => state.codexView);

  const {
    isLoading: isLoadingDelete,
    status: statusDelete,
    runQuery: runQueryDelete,
    resetQuery: resetQueryDelete,
  } = useQuery(`/api/object/${currentEntry?.id}`, requestMethods.DELETE);

  const handleRunQueryDelete = useCallback(() => {
    if (!isLoadingDelete && statusDelete) {
      if (statusDelete === 200) {
        dispatch(deleteEntry({ schemaId: currentSchema?.id, entryId: currentEntry?.id }));
        dispatch(setCurrentEntry({ newEntry: null }));
        props.setSnackbarSuccess('Entry deleted');
        props.setIsOpen(false);
        props.setIsPrimaryOpen(false);
      } else if (statusDelete === 400) {
        props.setSnackbarError('Error during entry deletion');
        props.setIsOpen(false);
      } else if (statusDelete === 404) {
        props.setSnackbarError('Entry not found');
        props.setIsOpen(false);
      }
      resetQueryDelete();
    }
  }, [
    currentEntry,
    currentSchema,
    dispatch,
    isLoadingDelete,
    props,
    resetQueryDelete,
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
