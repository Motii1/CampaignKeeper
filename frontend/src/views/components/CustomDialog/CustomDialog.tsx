import { Dialog, DialogContent, Stack } from '@mui/material';
import { CustomDialogTitle } from './components/CustomDialogTitle/CustomDialogTitle';
import { ReturnBar } from './components/ReturnBar/ReturnBar';

//TO-DO: add type of dialog (no/two/three buttons), info about buttons and their functions (if needed)
type CustomDialogProps = {
  title: string;
  isTitleRed?: boolean;
  isOpen: boolean;
  setIsOpen: (newState: boolean) => void;
};

//TO-DO: add buttons as another component (e.g. ButtonPanel)
export const CustomDialog: React.FC<CustomDialogProps> = ({
  isTitleRed = false,
  ...otherProps
}) => (
  <Dialog
    open={otherProps.isOpen}
    onClose={() => otherProps.setIsOpen(false)}
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
        <ReturnBar setOpen={otherProps.setIsOpen} />
        <CustomDialogTitle title={otherProps.title} isTitleRed={isTitleRed} />
        {otherProps.children}
      </Stack>
    </DialogContent>
  </Dialog>
);
