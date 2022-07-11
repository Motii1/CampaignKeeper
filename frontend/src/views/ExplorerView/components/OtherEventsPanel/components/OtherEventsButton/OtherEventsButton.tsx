import { CustomButtonBehavior, CustomButtonType } from '../../../../../../types/types';
import { CustomButton } from '../../../../../components/CustomButton/CustomButton';

type OtherEventsButton = {
  content: string;
  setIsOpen: (newIsOpen: boolean) => void;
};

export const OtherEventsButton: React.FC<OtherEventsButton> = props => (
  <CustomButton
    content={props.content}
    onClick={() => props.setIsOpen(true)}
    behavior={CustomButtonBehavior.Func}
    type={CustomButtonType.Accent}
  />
);
