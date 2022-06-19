import { Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Entry, Schema } from '../../../../../../../../../../../../CodexView/codexSlice';
import { setCurrentSchemaAndEntry } from '../../../../../../../../../../../../CodexView/codexViewSlice';
import viewsRoutes from '../../../../../../../../../../../../viewsRoutes';

type ReferenceChipProps = {
  entry: Entry;
  schema: Schema;
};

export const ReferenceChip: React.FC<ReferenceChipProps> = props => {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(
      setCurrentSchemaAndEntry({
        newSchema: props.schema,
        newEntry: props.entry,
      })
    );
    history.push(viewsRoutes.CODEX);
  };

  return props.entry ? (
    <Typography
      noWrap={true}
      variant="subtitle1"
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
