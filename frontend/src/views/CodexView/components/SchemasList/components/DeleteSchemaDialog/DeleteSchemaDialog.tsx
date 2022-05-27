import { Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../../../../axios/requestMethods';
import { useQuery } from '../../../../../../axios/useQuery';
import { RootState } from '../../../../../../store';
import { CustomDialog } from '../../../../../components/CustomDialog/CustomDialog';
import { deleteSchema } from '../../../../codexSlice';
import { resetCurrent } from '../../../../codexViewSlice';

type DeleteSchemaDialogProps = {
  schemaId: null | string;
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  setSnackbarSuccess: (message: string) => void;
  setSnackbarError: (message: string) => void;
};

export const DeleteSchemaDialog: React.FC<DeleteSchemaDialogProps> = props => {
  const dispatch = useDispatch();
  const { entries } = useSelector((state: RootState) => state.codex);

  const [canDelete, setCanDelete] = useState(
    props.schemaId ? entries[props.schemaId] === [] : false
  );

  useEffect(() => {
    setCanDelete(props.schemaId ? !entries[props.schemaId].length : false);
  }, [entries, props.schemaId]);

  const { isLoading, status, runQuery, resetQuery } = useQuery(
    `/api/schema/${props.schemaId}`,
    requestMethods.DELETE
  );

  const handleRunQuery = useCallback(() => {
    if (!isLoading && status) {
      if (status === 200) {
        dispatch(deleteSchema({ schemaId: props.schemaId }));
        dispatch(resetCurrent({}));
        props.setSnackbarSuccess('Schema deleted');
        props.setIsOpen(false);
      } else if (status === 400) {
        props.setSnackbarError('Error during schema deletion');
      } else if (status === 404) {
        props.setSnackbarError('Schema not found');
      }
      resetQuery();
    }
  }, [dispatch, isLoading, props, resetQuery, status]);

  useEffect(() => {
    handleRunQuery();
  }, [handleRunQuery]);

  const handleOk = () => {
    if (canDelete) runQuery();
  };

  const handleCancel = () => {
    props.setIsOpen(false);
  };

  return (
    <CustomDialog
      title={'Delete schema'}
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Typography variant="h6" sx={{ color: 'customPalette.onSurface', fontWeight: 'bold' }}>
        {"This action can't be undone."}
      </Typography>
    </CustomDialog>
  );
};
