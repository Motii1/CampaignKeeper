import { CustomButtonBehavior, CustomButtonType } from '../../../../../../types/types';
import { CustomButton } from '../../../../../components/CustomButton/CustomButton';

type OtherEventsButton = {
  content: string;
  setIsOpen: (newIsOpen: boolean) => void;
};

/**
 * Button opening OtherEventsPanel with children or parents of event
 * currently selected in ExplorerView (depends on content)
 * @param props
 * @returns
 */
export const OtherEventsButton: React.FC<OtherEventsButton> = props => (
  <CustomButton
    content={props.content}
    onClick={() => props.setIsOpen(true)}
    behavior={CustomButtonBehavior.Func}
    type={CustomButtonType.Inverted}
  />
);
