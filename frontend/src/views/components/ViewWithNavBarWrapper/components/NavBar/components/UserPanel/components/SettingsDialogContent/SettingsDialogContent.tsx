import { Box, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import requestMethods from '../../../../../../../../../axios/requestMethods';
import { useQuery } from '../../../../../../../../../axios/useQuery';
import { updateDetails } from '../../../../../../../../LandingView/userDetailsSlice';
import { CustomDialog } from '../../../../../../../CustomDialog/CustomDialog';
import { ChangeAvatarForm } from './components/ChangeAvatarForm/ChangeAvatarForm';
import { ChangePasswordForm } from './components/ChangePasswordForm/ChangePasswordForm';

type DetailsResponseData = {
  username: string;
  email: string;
  image: string;
};

export type ChangeFeedbackContentState = {
  title: string;
  text: string;
  isTitleRed: boolean;
};

// TO-DO: add change username, change email, change password
export const SettingsDialogContent: React.FC = () => {
  const dispatch = useDispatch();
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

  return (
    <Box>
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
        <ChangeAvatarForm
          setChangeFeedbackContent={setChangeFeedbackContent}
          setIsChangeFeedbackOpen={setIsChangeFeedbackOpen}
          runQueryDetails={runQueryDetails}
        />
        <ChangePasswordForm
          setChangeFeedbackContent={setChangeFeedbackContent}
          setIsChangeFeedbackOpen={setIsChangeFeedbackOpen}
          runQueryDetails={runQueryDetails}
        />
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
