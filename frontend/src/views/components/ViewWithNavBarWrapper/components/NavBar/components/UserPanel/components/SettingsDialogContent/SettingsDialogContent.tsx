import { Box, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import requestMethods from '../../../../../../../../../axios/requestMethods';
import { useQuery } from '../../../../../../../../../axios/useQuery';
import { CustomSnackbarType } from '../../../../../../../../../types/types';
import { updateDetails } from '../../../../../../../../LandingView/userDetailsSlice';
import { CustomSnackbar } from '../../../../../../../CustomSnackbar/CustomSnackbar';
import { ChangeAvatarForm } from './components/ChangeAvatarForm/ChangeAvatarForm';
import { ChangePasswordForm } from './components/ChangePasswordForm/ChangePasswordForm';

type DetailsResponseData = {
  username: string;
  email: string;
  image: string;
};

// TO-DO: add change username, change email, change password
export const SettingsDialogContent: React.FC = () => {
  const dispatch = useDispatch();
  const [changeFeedbackMessage, setChangeFeedbackMessage] = useState<string>('');
  const [changeFeedbackType, setChangeFeedbackType] = useState<CustomSnackbarType>(
    CustomSnackbarType.Success
  );
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
          setChangeFeedbackMessage={setChangeFeedbackMessage}
          setChangeFeedbackType={setChangeFeedbackType}
          setIsChangeFeedbackOpen={setIsChangeFeedbackOpen}
          runQueryDetails={runQueryDetails}
        />
        <ChangePasswordForm
          setChangeFeedbackMessage={setChangeFeedbackMessage}
          setChangeFeedbackType={setChangeFeedbackType}
          setIsChangeFeedbackOpen={setIsChangeFeedbackOpen}
          runQueryDetails={runQueryDetails}
        />
      </Stack>
      <CustomSnackbar
        isOpen={isChangeFeedbackOpen}
        setIsOpen={setIsChangeFeedbackOpen}
        message={changeFeedbackMessage}
        type={changeFeedbackType}
      />
    </Box>
  );
};
