import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Tooltip } from '@mui/material';

type EditIconProps = {
  handleClick: () => void;
};

/**
 * Icon serving as button which opens MapDialog in "edit event" mode on click
 * @param props
 * @returns
 */
export const EditIcon: React.FC<EditIconProps> = props => (
  <Tooltip title="Edit event">
    <EditOutlinedIcon
      onClick={props.handleClick}
      fontSize="small"
      sx={{ color: 'customPalette.onAccent', opacity: '0.8', cursor: 'pointer' }}
    />
  </Tooltip>
);
