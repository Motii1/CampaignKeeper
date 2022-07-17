import { Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { EventTileType } from '../../../../../../../../../types/types';
import { Entry, Schema } from '../../../../../../../../CodexView/codexSlice';
import { setCurrentSchemaAndEntry } from '../../../../../../../../CodexView/codexViewSlice';
import viewsRoutes from '../../../../../../../../viewsRoutes';

type EntryReferenceChipProps = {
  entry: Entry;
  schema: Schema;
  type: EventTileType;
};

export const EntryReferenceChip: React.FC<EntryReferenceChipProps> = props => {
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

  return (
    <Typography
      noWrap={true}
      variant={props.type === EventTileType.Explorer ? 'subtitle1' : 'subtitle2'}
      sx={{
        fontWeight: 'bold',
        color: 'customPalette.onAccent',
        backgroundColor: 'customPalette.accent',
        cursor: 'pointer',
        paddingLeft: '6px',
        paddingRight: '6px',
        marginLeft: '2px',
        marginRight: '2px',
        borderRadius: '10px',
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
  );
};
