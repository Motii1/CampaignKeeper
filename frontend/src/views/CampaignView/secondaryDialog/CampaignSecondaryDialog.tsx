import { Typography } from '@mui/material';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';

type CampaignSecondaryCustomDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
};

export const CampaignSecondaryDialog: React.FC<CampaignSecondaryCustomDialogProps> = props => {
  const handleOk = () => {
    //here will go deleting campaign by useQuery
    props.setIsOpen(false);
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
