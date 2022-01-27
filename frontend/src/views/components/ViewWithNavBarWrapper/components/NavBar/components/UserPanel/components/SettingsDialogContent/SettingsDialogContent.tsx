import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import requestMethods from '../../../../../../../../../axios/requestMethods';
import { useQuery } from '../../../../../../../../../axios/useQuery';
import { RootState } from '../../../../../../../../../store';
import { CustomButton } from '../../../../../../../CustomButton/CustomButton';
import { CustomButtonType } from '../../../../../../../CustomButton/CustomButtonTypes';
import { CustomDialog } from '../../../../../../../CustomDialog/CustomDialog';

type ImageResponseData = {
  message?: string;
};

type ChangeFeedbackContentState = {
  title: string;
  text: string;
  isTitleRed: boolean;
};

// TO-DO: add change username, change email, change password
export const SettingsDialogContent: React.FC = () => {
  const { username, avatar } = useSelector((state: RootState) => state.user);
  const [changeFeedbackContent, setChangeFeedbackContent] = useState<ChangeFeedbackContentState>({
    title: '',
    text: '',
    isTitleRed: false,
  });
  const [isChangeFeedbackOpen, setIsChangeFeedbackOpen] = useState(false);

  // handles change avatar query
  const { isLoading, data, status, runQuery } = useQuery<ImageResponseData>(
    `/api/user/image`,
    requestMethods.PUT,
    { 'Content-Type': 'multipart/form-data' }
  );

  const handleChange = (files: null | FileList) => {
    if (files) {
      const file = files.item(0);
      if (file) {
        const payload = new FormData();
        payload.append('image-file', file);
        runQuery(payload);
      }
    }
  };

  const handleRunQuery = useCallback(() => {
    if (!isLoading && status) {
      if (status === 200) {
        setChangeFeedbackContent({
          title: 'Sucess',
          text: 'Avatar successfully changed',
          isTitleRed: false,
        });
      } else if (status === 400 && data) {
        setChangeFeedbackContent({
          title: 'Error',
          text: data.message ? data.message : 'Failure during avatar change',
          isTitleRed: true,
        });
      }
      setIsChangeFeedbackOpen(true);
    }
  }, [data, isLoading, setChangeFeedbackContent, setIsChangeFeedbackOpen, status]);

  useEffect(() => {
    handleRunQuery();
  }, [handleRunQuery]);

  return (
    <Box>
      <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={0.5}>
        <Stack spacing={1}>
          <Typography variant="h6">AVATAR</Typography>
          <Avatar
            alt={String(username)}
            src={`data:;charset=utf-8;base64,${avatar}`}
            sx={{ width: 90, height: 90 }}
          />
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
            <CustomButton text={'Change'} type={CustomButtonType.Upload} />
          </label>
        </Stack>
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
