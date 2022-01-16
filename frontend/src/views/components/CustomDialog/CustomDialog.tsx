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
//TO-DO: add variable width
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
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={0}
        // sx={{
        //   backgroundColor: 'common.black',
        // }}
      >
        <ReturnBar setOpen={props.setIsOpen} />
        <CustomDialogTitle title={props.title} />
        {props.children}
      </Stack>
    </DialogContent>
  </Dialog>
);
