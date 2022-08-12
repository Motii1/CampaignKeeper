import { Menu, MenuItem } from '@mui/material';

type EditMenuProps = {
  menuPos: null | { mouseX: number; mouseY: number };
  handleEdit: () => void;
  handleClose: () => void;
};

/**
 * Context menu used to start process of edition of element it was open on
 * (e.g. by opening dialog which allows to change element properties)
 * - process execution depends on function passed from parent (handleEdit)
 * @param props
 * @returns
 */
export const EditMenu: React.FC<EditMenuProps> = props => (
  <Menu
    elevation={1}
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
        boxShadow: '0px 0px 15px -9px rgba(66, 68, 90, 1)',
      },
    }}
    disableAutoFocusItem
  >
    <MenuItem onClick={props.handleEdit}>Edit</MenuItem>
  </Menu>
);
