import { Dialog, DialogContent, Stack } from '@mui/material';
import { CustomDialogTitle } from './components/CustomDialogTitle/CustomDialogTitle';
import { ReturnBar } from './components/ReturnBar/ReturnBar';

type CustomDialogProps = {
  title: string;
  hasButtons: boolean;
  cancelButtonCallback?: () => void;
  okButtonCallback?: () => void;
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
};

//TO-DO: add buttons (and create them in elements)
export const CustomDialog: React.FC<CustomDialogProps> = props => (
  <Dialog open={props.isOpen} onClose={() => props.setIsOpen(false)}>
    <DialogContent sx={{ backgroundColor: 'customPalette.surface', minWidth: '20vw' }}>
      <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={0.5}>
        <ReturnBar setOpen={props.setIsOpen} />
        <CustomDialogTitle title={props.title} />
        {props.children}
      </Stack>
    </DialogContent>
  </Dialog>
);
