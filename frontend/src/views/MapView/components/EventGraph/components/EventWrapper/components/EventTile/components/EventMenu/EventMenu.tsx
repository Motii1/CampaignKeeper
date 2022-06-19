import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Stack } from '@mui/material';

// TO-DO: add logic to icons and changing them according to state
export const EventMenu: React.FC = () => (
  <Stack
    direction="row"
    justifyContent="flex-end"
    alignItems="center"
    spacing={1}
    sx={{ position: 'absolute', right: '5px', top: '5px' }}
  >
    <EditOutlinedIcon fontSize="small" />
    <VisibilityOutlinedIcon fontSize="small" />
    <CheckBoxOutlinedIcon fontSize="small" />
  </Stack>
);
