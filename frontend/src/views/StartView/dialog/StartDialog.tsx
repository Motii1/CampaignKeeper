/* eslint-disable no-console */
import { Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../axios/requestMethods';
import { useQuery } from '../../../axios/useQuery';
import { RootState } from '../../../store';
import { NavBarViewDialog } from '../../../types/types';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { ImageUploadField } from '../../components/ImageUploadField/ImageUploadField';
import { LabeledTextInput } from '../../components/LabeledTextInput/LabeledTextInput';
import { addCampaign, editCampaign } from '../campaignsSlice';
import { resetState, updateState } from '../startViewSlice';

type SingleCampaignData = {
  image: null | string;
  name: string;
  schemas: number[];
  sessions: number[];
  user: number;
};

type StartDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  dialogType: NavBarViewDialog;
  setIsSecondaryOpen: (newIsOpen: boolean) => void;
};

//TO-DO: think about adding wrapper (for all NavBarViews) on stack inside CustomDialog
//TO-DO: close Edit dialog after deleting campaign (export isOpen of primary dialog to Redux?)
export const StartDialog: React.FC<StartDialogProps> = props => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(
    props.dialogType === NavBarViewDialog.NewCampaign ? 'New campaign' : 'Edit campaign'
  );
  const name = useSelector((state: RootState) => state.startView.name);
  const image = useSelector((state: RootState) => state.startView.image);
  const id = useSelector((state: RootState) => state.startView.id);

  const [helperText, setHelperText] = useState<null | string>('');

  const {
    isLoading: isLoadingNew,
    data: dataNew,
    status: statusNew,
    runQuery: runQueryNew,
    resetQuery: resetQueryNew,
  } = useQuery<SingleCampaignData>(`/api/campaign`, requestMethods.POST);

  const handleRunQueryNew = useCallback(() => {
    if (!isLoadingNew && statusNew) {
      if (statusNew === 200) {
        dispatch(addCampaign({ newCampaign: dataNew }));
      } else if (statusNew === 400) {
        console.log('Error on server');
      }
      resetQueryNew();
    }
  }, [dataNew, dispatch, isLoadingNew, resetQueryNew, statusNew]);

  useEffect(() => {
    handleRunQueryNew();
  }, [handleRunQueryNew]);

  const {
    isLoading: isLoadingEdit,
    status: statusEdit,
    runQuery: runQueryEdit,
    resetQuery: resetQueryEdit,
  } = useQuery<SingleCampaignData>(`api/campaign/${id}`, requestMethods.PATCH);

  const handleRunQueryEdit = useCallback(() => {
    if (!isLoadingEdit && statusEdit) {
      if (statusEdit === 200) {
        dispatch(editCampaign({ id: id, name: name }));
      } else if (statusEdit === 400 || statusEdit === 404) {
        console.log('Error on server');
      }
      resetQueryEdit();
    }
  }, [dispatch, id, isLoadingEdit, name, resetQueryEdit, statusEdit]);

  useEffect(() => {
    handleRunQueryEdit();
  }, [handleRunQueryEdit]);

  useEffect(() => {
    setTitle(props.dialogType === NavBarViewDialog.NewCampaign ? 'New campaign' : 'Edit campaign');
  }, [props.dialogType]);

  const validateName = (newName: string) => (checkName(newName) ? '' : 'Too long/short name');

  const checkName = (newName: string) => newName.length > 5 && newName.length < 43;

  const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(updateState({ name: event.target.value }));
    setHelperText(null);
  };

  const handleTextInputLeave = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newName = event.target.value;
    dispatch(updateState({ name: event.target.value }));
    setHelperText(validateName(newName));
  };

  const resetDialog = () => {
    setHelperText('');
    dispatch(resetState({}));
  };

  // TO-DO: should we redirect user to campaign view after creation of new campaign?
  const handleOk = () => {
    if (props.dialogType === NavBarViewDialog.NewCampaign) {
      if (checkName(name)) {
        runQueryNew({
          name: name,
        });
        props.setIsOpen(false);
        resetDialog();
      }
    } else {
      runQueryEdit({
        name: name,
      });
    }
  };

  const handleCancel = () => {
    props.setIsOpen(false);
    resetDialog();
  };

  // important: secondaryDialog is responsible for handling deletion, here we only open it
  const handleDelete = () => {
    props.setIsSecondaryOpen(true);
  };

  const handleClose = () => {
    props.setIsOpen(false);
    if (props.dialogType === NavBarViewDialog.EditCampaign) resetDialog();
  };

  return (
    <CustomDialog
      title={title}
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      onDelete={props.dialogType === NavBarViewDialog.EditCampaign ? handleDelete : undefined}
      onClose={handleClose}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={1}
        sx={{ width: '100%' }}
      >
        <LabeledTextInput
          text={'NAME'}
          placeholder={'Type here'}
          defaultValue={name}
          helperText={helperText}
          defaultHelperText={''}
          onChange={event => handleTextInputChange(event)}
          onBlur={event => handleTextInputLeave(event)}
        />
        <ImageUploadField
          height={180}
          width={390}
          image={image}
          setImage={newImage => dispatch(updateState({ image: newImage }))}
        />
      </Stack>
    </CustomDialog>
  );
};
