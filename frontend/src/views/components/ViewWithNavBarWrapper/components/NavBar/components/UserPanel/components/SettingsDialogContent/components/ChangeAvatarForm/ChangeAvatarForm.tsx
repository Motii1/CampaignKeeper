import { Avatar, Stack, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import requestMethods from '../../../../../../../../../../../axios/requestMethods';
import { useQuery } from '../../../../../../../../../../../axios/useQuery';
import { RootState } from '../../../../../../../../../../../store';
import {
  CustomButtonBehavior,
  CustomSnackbarType,
} from '../../../../../../../../../../../types/types';
import { CustomButton } from '../../../../../../../../../CustomButton/CustomButton';

type ImageResponseData = {
  message?: string;
};

type ChangeAvatarFormProps = {
  setChangeFeedbackMessage: (newFeedbackMessage: string) => void;
  setChangeFeedbackType: (newFeedbackType: CustomSnackbarType) => void;
  setIsChangeFeedbackOpen: (newIsOpen: boolean) => void;
  runQueryDetails: (payload?: unknown) => void;
};

export const ChangeAvatarForm: React.FC<ChangeAvatarFormProps> = props => {
  const { username, avatar } = useSelector((state: RootState) => state.user);

  // handles change user details query
  const {
    isLoading: isLoadingImg,
    data: dataImg,
    status: statusImg,
    runQuery: runQueryImg,
    resetQuery: resetQueryImg,
  } = useQuery<ImageResponseData>(`/api/user/image`, requestMethods.PUT, {
    'Content-Type': 'multipart/form-dataImg',
  });

  const handleChange = (files: null | FileList) => {
    if (files) {
      const file = files.item(0);
      if (file) {
        const payload = new FormData();
        payload.append('image-file', file);
        runQueryImg(payload);
      }
    }
  };

  const handleRunQueryImg = useCallback(() => {
    if (!isLoadingImg && statusImg) {
      if (statusImg === 200) {
        props.runQueryDetails();
        props.setChangeFeedbackMessage('Avatar changed succesfully');
        props.setChangeFeedbackType(CustomSnackbarType.Success);
      } else if (statusImg === 400 && dataImg) {
        props.setChangeFeedbackMessage(
          dataImg.message ? dataImg.message : 'Failure during avatar change'
        );
        props.setChangeFeedbackType(CustomSnackbarType.Error);
      }
      props.setIsChangeFeedbackOpen(true);
      resetQueryImg();
    }
  }, [dataImg, isLoadingImg, props, resetQueryImg, statusImg]);

  useEffect(() => {
    handleRunQueryImg();
  }, [handleRunQueryImg]);

  return (
    <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={1}>
      <Typography variant="h6">AVATAR</Typography>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        sx={{ paddingBottom: 1 }}
      >
        <Avatar
          alt={String(username)}
          src={`data:;charset=utf-8;base64,${avatar}`}
          sx={{ width: 90, height: 90 }}
        />
      </Stack>
      <input
        accept="image/*"
        id="avatar-button-file"
        type="file"
        hidden
        onChange={e => {
          if (e) handleChange(e.target.files);
        }}
      />
      <label htmlFor="avatar-button-file">
        <CustomButton text={'Change'} behavior={CustomButtonBehavior.Upload} />
      </label>
    </Stack>
  );
};
