import { Box, Dialog, DialogContent, Stack } from '@mui/material';
import { CustomButtonBehavior, CustomButtonType } from '../../../types/types';
import { CustomButton } from '../CustomButton/CustomButton';
import { CustomDialogTitle } from './components/CustomDialogTitle/CustomDialogTitle';
import { ReturnBar } from './components/ReturnBar/ReturnBar';

type CustomDialogProps = {
  title: string;
  isTitleRed?: boolean;
  isOpen: boolean;
  isLarge?: undefined | boolean;
  setIsOpen: (newState: boolean) => void;
  onOk?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
};

export const CustomDialog: React.FC<CustomDialogProps> = ({
  isTitleRed = false,
  ...otherProps
}) => {
  const renderButtons = () => {
    if (otherProps.onOk || otherProps.onCancel || otherProps.onDelete)
      return (
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
          sx={{ width: '100%', paddingTop: 0, paddingBottom: 1.9 }}
        >
          {otherProps.onDelete ? (
            <CustomButton
              content="DELETE"
              behavior={CustomButtonBehavior.Func}
              type={CustomButtonType.Delete}
              onClick={otherProps.onDelete}
            />
          ) : null}
          {otherProps.onCancel ? (
            <CustomButton
              content="CANCEL"
              behavior={CustomButtonBehavior.Func}
              type={CustomButtonType.Primary}
              onClick={otherProps.onCancel}
            />
          ) : null}
          {otherProps.onOk ? (
            <CustomButton
              content="OK"
              behavior={CustomButtonBehavior.Func}
              onClick={otherProps.onOk}
            />
          ) : null}
          <Box sx={{ width: 11 }} />
        </Stack>
      );
    else return null;
  };

  return (
    <Dialog
      open={otherProps.isOpen}
      onClose={otherProps.onClose ? otherProps.onClose : () => otherProps.setIsOpen(false)}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: 'customPalette.surface',
          borderRadius: 3,
        },
      }}
    >
      <DialogContent
        sx={{
          minWidth: otherProps.isLarge ? 600 : 370,
          maxHeight: 'calc(100vh - 100px)',
          paddingTop: 1.6,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          overflow: 'hidden',
        }}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          spacing={1}
          sx={{
            height: '100%',
            maxHeight: '100%',
            width: '100%',
          }}
        >
          <ReturnBar setOpen={otherProps.setIsOpen} />
          <CustomDialogTitle title={otherProps.title} isTitleRed={isTitleRed} />
          <Box
            sx={{
              width: '100%',
              maxHeight: 'calc(100vh - 270px)',
              overflowY: 'auto',
            }}
          >
            <Box sx={{ paddingLeft: 2.4, paddingRight: 2.4, paddingBlock: 1.4 }}>
              {otherProps.children}
            </Box>
          </Box>
          {renderButtons()}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

CustomDialog.defaultProps = {
  isLarge: false,
} as Partial<CustomDialogProps>;
