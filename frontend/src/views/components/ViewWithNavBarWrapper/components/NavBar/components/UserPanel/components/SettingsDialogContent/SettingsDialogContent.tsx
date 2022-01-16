import { Avatar, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../../../store';
import { StandardButton } from '../../../../../../../StandardButton/StandardButton';

// TO-DO: add change username, change email, change password
export const SettingsDialogContent: React.FC = () => {
  const { username, avatar } = useSelector((state: RootState) => state.user);

  // here goes avatar changing function which should be attached to second Stack as onSubmit

  return (
    <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={0.5}>
      <Stack spacing={1}>
        <Typography variant="h6">AVATAR</Typography>
        <Avatar
          alt={String(username)}
          src={`data:;charset=utf-8;base64,${avatar}`}
          sx={{ width: 90, height: 90 }}
        />
        <StandardButton text={'Change'} />
      </Stack>
    </Stack>
  );
};
