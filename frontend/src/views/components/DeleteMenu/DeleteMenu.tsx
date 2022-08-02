import { Menu, MenuItem } from '@mui/material';

type DeleteMenuProps = {
  menuPos: null | { mouseX: number; mouseY: number };
  handleDelete: () => void;
  handleClose: () => void;
};

/**
 * Context menu used to start process of deletion of element it was open on
 * (e.g. by opening dialog which asks for confrmation) - process execution depends
 * on function passed from parent (handleDelete)
 * @param props
 * @returns
 */
export const DeleteMenu: React.FC<DeleteMenuProps> = props => (
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
    <MenuItem onClick={props.handleDelete}>Delete</MenuItem>
  </Menu>
);
