import { Dialog, DialogContent, Stack } from '@mui/material';
import { CustomDialogTitle } from './components/CustomDialogTitle/CustomDialogTitle';
import { ReturnBar } from './components/ReturnBar/ReturnBar';

type CustomDialogProps = {
  title: string;
  isTitleRed?: boolean;
  hasButtons: boolean;
  cancelButtonCallback?: () => void;
  okButtonCallback?: () => void;
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
};

//TO-DO: add buttons (and create them in elements)
export const CustomDialog: React.FC<CustomDialogProps> = props => (
  <Dialog
    open={props.isOpen}
    onClose={() => props.setIsOpen(false)}
    sx={{
      '& .MuiDialog-paper': {
        backgroundColor: 'customPalette.surface',
        borderRadius: 3,
      },
    }}
  >
    <DialogContent
      sx={{
        minWidth: '20vw',
        maxHeight: '90wh',
        paddingTop: 1.6,
        paddingBottom: 1.7,
        paddingLeft: 2.4,
        paddingRight: 2.4,
      }}
    >
      <Stack direction="column" justifyContent="center" alignItems="flex-start" spacing={0}>
        <ReturnBar setOpen={props.setIsOpen} />
        <CustomDialogTitle title={props.title} isTitleRed={props.isTitleRed} />
        {props.children}
      </Stack>
    </DialogContent>
  </Dialog>
);

CustomDialog.defaultProps = {
  isTitleRed: false,
} as Partial<CustomDialogProps>;
