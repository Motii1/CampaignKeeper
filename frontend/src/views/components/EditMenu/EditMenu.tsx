import { Menu, MenuItem } from '@mui/material';

type EditMenuProps = {
  menuPos: null | { mouseX: number; mouseY: number };
  handleEdit: () => void;
  handleClose: () => void;
};

export const EditMenu: React.FC<EditMenuProps> = props => (
  <Menu
    open={props.menuPos !== null}
    onClose={props.handleClose}
    anchorReference="anchorPosition"
    anchorPosition={
      props.menuPos !== null ? { top: props.menuPos.mouseY, left: props.menuPos.mouseX } : undefined
    }
    sx={{
      '& .MuiPaper-root': {
        backgroundColor: 'customPalette.primary',
        borderRadius: 4,
        minWidth: 160,
      },
    }}
    disableAutoFocusItem
  >
    <MenuItem onClick={props.handleEdit}>Edit</MenuItem>
  </Menu>
);
