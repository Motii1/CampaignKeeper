import Cancel from '@mui/icons-material/Cancel';
import { Chip, Stack } from '@mui/material';

type ParentProps = {
  name: string | undefined;
  id: string;
  parents: string[];
  setParents: (newParents: string[]) => void;
};

/**
 * Chip used to represent reference to parent event in EventDialog,
 * allows removing displayed event from list of parents
 * @param props
 * @returns
 */
export const Parent: React.FC<ParentProps> = props => {
  const onDelete = () => {
    props.setParents(props.parents.filter(parent => parent !== props.id));
  };

  return (
    <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={0.5}>
      <Chip
        label={props.name}
        sx={{
          backgroundColor: 'customPalette.accent',
          color: 'customPalette.onAccent',
          fontWeight: 'bold',
        }}
        deleteIcon={<Cancel sx={{ fill: '#262E38' }} />}
        onDelete={onDelete}
      />
    </Stack>
  );
};
