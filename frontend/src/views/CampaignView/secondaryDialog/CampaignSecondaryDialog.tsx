import { Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';
import { removeSession } from '../campaignViewSlice';

type CampaignSecondaryCustomDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  setIsPrimaryOpen: (newIsOpen: boolean) => void;
};

export const CampaignSecondaryDialog: React.FC<CampaignSecondaryCustomDialogProps> = props => {
  const dispatch = useDispatch();
  const name = useSelector((state: RootState) => state.campaignView.name);

  const handleOk = () => {
    //here will go deleting campaign by useQuery
    dispatch(removeSession({ sessionName: name }));
    props.setIsOpen(false);
    props.setIsPrimaryOpen(false);
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
