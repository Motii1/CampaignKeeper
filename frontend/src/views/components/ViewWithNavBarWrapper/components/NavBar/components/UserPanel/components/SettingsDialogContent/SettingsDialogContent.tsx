import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestMethods from '../../../../../../../../../axios/requestMethods';
import { useQuery } from '../../../../../../../../../axios/useQuery';
import { RootState } from '../../../../../../../../../store';
import { CustomButtonBehavior } from '../../../../../../../../../types/types';
import { updateDetails } from '../../../../../../../../LandingView/userDetailsSlice';
import { CustomButton } from '../../../../../../../CustomButton/CustomButton';
import { CustomDialog } from '../../../../../../../CustomDialog/CustomDialog';

type ImageResponseData = {
  message?: string;
};

type DetailsResponseData = {
  username: string;
  email: string;
  image: string;
};

type ChangeFeedbackContentState = {
  title: string;
  text: string;
  isTitleRed: boolean;
};

// TO-DO: add change username, change email, change password
export const SettingsDialogContent: React.FC = () => {
  const dispatch = useDispatch();
  const { username, avatar } = useSelector((state: RootState) => state.user);
  const [changeFeedbackContent, setChangeFeedbackContent] = useState<ChangeFeedbackContentState>({
    title: '',
    text: '',
    isTitleRed: false,
  });
  const [isChangeFeedbackOpen, setIsChangeFeedbackOpen] = useState(false);

  //handles fetching new user details and updating them in store
  const {
    isLoading: isLoadingDetails,
    data: dataDetails,
    status: statusDetails,
    runQuery: runQueryDetails,
    resetQuery: resetQueryDetails,
  } = useQuery<DetailsResponseData>(`/api/user/details`, requestMethods.GET);

  const handleRunQueryDetails = useCallback(() => {
    if (!isLoadingDetails && statusDetails) {
      if (statusDetails === 200 && dataDetails) {
        dispatch(
          updateDetails({
            username: dataDetails.username,
            email: dataDetails.email,
            avatar: dataDetails.image,
          })
        );
        resetQueryDetails();
      }
    }
  }, [dataDetails, dispatch, isLoadingDetails, resetQueryDetails, statusDetails]);

  useEffect(() => {
    handleRunQueryDetails();
  }, [handleRunQueryDetails]);

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
        setChangeFeedbackContent({
          title: 'Sucess',
          text: 'Avatar successfully changed',
          isTitleRed: false,
        });
        runQueryDetails();
      } else if (statusImg === 400 && dataImg) {
        setChangeFeedbackContent({
          title: 'Error',
          text: dataImg.message ? dataImg.message : 'Failure during avatar change',
          isTitleRed: true,
        });
      }
      setIsChangeFeedbackOpen(true);
      resetQueryImg();
    }
  }, [dataImg, isLoadingImg, resetQueryImg, runQueryDetails, statusImg]);

  useEffect(() => {
    handleRunQueryImg();
  }, [handleRunQueryImg]);

  return (
    <Box>
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
      <CustomDialog
        title={changeFeedbackContent.title}
        isTitleRed={changeFeedbackContent.isTitleRed}
        isOpen={isChangeFeedbackOpen}
        setIsOpen={setIsChangeFeedbackOpen}
      >
        <Typography variant="subtitle1">{changeFeedbackContent.text}</Typography>
      </CustomDialog>
    </Box>
  );
};
