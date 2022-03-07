import { Box, Stack } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import requestMethods from '../../../../../../../../../axios/requestMethods';
import { useQuery } from '../../../../../../../../../axios/useQuery';
import { CustomSnackbarType } from '../../../../../../../../../types/types';
import { updateDetails } from '../../../../../../../../LandingView/userDetailsSlice';
import { ChangeAvatarForm } from './components/ChangeAvatarForm/ChangeAvatarForm';
import { ChangePasswordForm } from './components/ChangePasswordForm/ChangePasswordForm';

type DetailsResponseData = {
  username: string;
  email: string;
  image: string;
};

type SettingsDialogContentProps = {
  setSnackbarMessage: (newSnackbarMessage: string) => void;
  setSnackbarType: (newSnackbarType: CustomSnackbarType) => void;
  setIsSnackbarOpen: (newIsSnackbarOpen: boolean) => void;
};

// TO-DO: add change username, change email, change password
export const SettingsDialogContent: React.FC<SettingsDialogContentProps> = props => {
  const dispatch = useDispatch();

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
          setSnackbarMessage={props.setSnackbarMessage}
          setSnackbarType={props.setSnackbarType}
          setIsSnackbarOpen={props.setIsSnackbarOpen}
          runQueryDetails={runQueryDetails}
        />
        <ChangePasswordForm
          setSnackbarMessage={props.setSnackbarMessage}
          setSnackbarType={props.setSnackbarType}
          setIsSnackbarOpen={props.setIsSnackbarOpen}
          runQueryDetails={runQueryDetails}
        />
      </Stack>
    </Box>
  );
};
