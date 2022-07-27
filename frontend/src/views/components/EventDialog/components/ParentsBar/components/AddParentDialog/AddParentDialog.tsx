import { MenuItem, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store';
import { compareEventsByTitle } from '../../../../../../../utils/utils';
import { CustomDialog } from '../../../../../CustomDialog/CustomDialog';
import { CustomSelect } from '../../../../../CustomSelect/CustomSelect';

type AddParentDialogProps = {
  currentEventId: string;
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  parents: string[];
  setParents: (newFields: string[]) => void;
};

/**
 * Dialog used to add another parent to event's parents list in EventDialog
 * @param props
 * @returns
 */
export const AddParentDialog: React.FC<AddParentDialogProps> = props => {
  const { eventsList } = useSelector((state: RootState) => state.events);

  const [selectedParent, setSelectedParent] = useState<string | undefined>(undefined);

  const onOk = () => {
    if (selectedParent) {
      const newParents = props.parents.concat(selectedParent);
      props.setParents(newParents);
      props.setIsOpen(false);
    }
  };

  const onCancel = () => {
    setSelectedParent(undefined);
    props.setIsOpen(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedParent(event.target.value);
  };

  const renderValue = (value: string) => {
    if (props.parents.includes(selectedParent as string)) return 'Choose parent';
    if (value !== '') return eventsList.find(event => event.id === value)?.title;
    return 'Choose parent';
  };

  const renderItems = () => {
    const possibleParents = eventsList
      .filter(event => !props.parents.includes(event.id) && event.id !== props.currentEventId)
      .sort(compareEventsByTitle)
      .map(event => (
        <MenuItem value={event.id} key={event.id}>
          {event.title}
        </MenuItem>
      ));

    return possibleParents;
  };

  return (
    <CustomDialog
      title={'Add parent'}
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      onOk={onOk}
      onCancel={onCancel}
    >
      <CustomSelect
        labelId={'event-parent-select'}
        handleChange={handleChange}
        value={props.parents.includes(selectedParent as string) ? '' : selectedParent}
        renderValue={renderValue}
      >
        {renderItems()}
      </CustomSelect>
    </CustomDialog>
  );
};
