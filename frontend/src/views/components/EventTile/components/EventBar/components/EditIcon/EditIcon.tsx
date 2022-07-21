import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Tooltip } from '@mui/material';

type EditIconProps = {
  handleClick: () => void;
};

export const EditIcon: React.FC<EditIconProps> = props => (
  <Tooltip title="Edit event">
    <EditOutlinedIcon
      onClick={props.handleClick}
      fontSize="small"
      sx={{ color: 'customPalette.onAccent', opacity: '0.8', cursor: 'pointer' }}
    />
  </Tooltip>
);
