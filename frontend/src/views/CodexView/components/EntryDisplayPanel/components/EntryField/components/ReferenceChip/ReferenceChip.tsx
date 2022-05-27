import { Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../../../store';
import { Entry } from '../../../../../../codexSlice';
import { setCurrentSchemaAndEntry } from '../../../../../../codexViewSlice';

type ReferenceChipProps = {
  entry: Entry | null;
};

export const ReferenceChip: React.FC<ReferenceChipProps> = props => {
  const dispatch = useDispatch();
  const { schemas } = useSelector((state: RootState) => state.codex);

  const handleClick = () => {
    const newSchema = schemas.find(schema => schema.id === props.entry?.schemaId);
    if (newSchema)
      dispatch(
        setCurrentSchemaAndEntry({
          newSchema: newSchema,
          newEntry: props.entry,
        })
      );
  };

  return props.entry ? (
    <Typography
      noWrap={true}
      sx={{
        fontWeight: 'bold',
        color: 'customPalette.onAccent',
        backgroundColor: 'customPalette.accent',
        cursor: 'pointer',
        paddingLeft: '4px',
        paddingRight: '4px',
        marginLeft: '2px',
        marginRight: '2px',
        borderRadius: '5px',
        width: 'max-content',
        display: 'inline',
        '&:hover': {
          opacity: 0.9,
        },
      }}
      onClick={handleClick}
    >
      {props.entry.title}
    </Typography>
  ) : null;
};
