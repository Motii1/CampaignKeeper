import { useState } from 'react';
import { CustomDialog } from '../../components/CustomDialog/CustomDialog';

export const StartCustomDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return <CustomDialog title={'New Campaign'} isOpen={isOpen} setIsOpen={setIsOpen} />;
};
