import { Typography } from '@mui/material';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';

type StartSecondaryCustomDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
};

export const StartSecondaryDialog: React.FC<StartSecondaryCustomDialogProps> = props => {
  const handleOk = () => {
    //here will go deleting campaign by useQuery
  };

  const handleCancel = () => {
    props.setIsOpen(false);
  };

  return (
    <CustomDialog
      title={'Are you sure?'}
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        {"This action can't be undone."}
      </Typography>
    </CustomDialog>
  );
};
