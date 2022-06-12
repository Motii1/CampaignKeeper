import { MenuItem, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store';
import { CustomDialog } from '../../../../../../components/CustomDialog/CustomDialog';
import { CustomSelect } from '../../../../../../components/CustomSelect/CustomSelect';

type AddParentDialogProps = {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
  parents: string[];
  setParents: (newFields: string[]) => void;
};

export const AddParentDialog: React.FC<AddParentDialogProps> = props => {
  const { eventsList } = useSelector((state: RootState) => state.session);

  const [selectedParent, setSelectedParent] = useState<null | string>(null);

  const onOk = () => {
    if (selectedParent) {
      const newParents = props.parents.concat(selectedParent);
      props.setParents(newParents);
      props.setIsOpen(false);
    }
  };

  const onCancel = () => {
    setSelectedParent(null);
    props.setIsOpen(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedParent(event.target.value);
  };

  const renderValue = (value: string) =>
    value === 'root'
      ? 'Start'
      : value !== ''
      ? eventsList.find(event => event.id === value)?.title
      : 'Choose parent';

  const renderItems = () => {
    const possibleParents = eventsList
      .filter(event => !props.parents.includes(event.id))
      .map(event => (
        <MenuItem value={event.id} key={event.id}>
          {event.title}
        </MenuItem>
      ));
    if (!props.parents.includes('root'))
      possibleParents.unshift(
        <MenuItem value="root" key="root">
          Start
        </MenuItem>
      );
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
        renderValue={renderValue}
      >
        {renderItems()}
      </CustomSelect>
    </CustomDialog>
  );
};
