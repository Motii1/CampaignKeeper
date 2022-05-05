import { Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../store';
import { fetchEntries, setCurrentEntry, setCurrentSchema } from '../../../../codexViewSlice';

type SchemaListElementProps = {
  name: string;
  schemaId: string;
};

export const SchemasListElement: React.FC<SchemaListElementProps> = props => {
  const dispatch = useDispatch();
  const { currentSchema, downloadedSchemas } = useSelector((state: RootState) => state.codexView);
  const [isElementSelected, setIsElementSelected] = useState<boolean>(
    props.schemaId === currentSchema?.id
  );

  useEffect(() => {
    setIsElementSelected(props.schemaId === currentSchema?.id);
  }, [currentSchema?.id, props.schemaId]);

  const onClick = () => {
    dispatch(setCurrentSchema({ newSchemaId: props.schemaId }));
    dispatch(setCurrentEntry({ newEntryId: null }));
    if (!downloadedSchemas.find(element => element === props.schemaId))
      dispatch(fetchEntries(props.schemaId));

    setIsElementSelected(true);
  };

  return (
    <Paper
      square
      elevation={0}
      onClick={onClick}
      sx={{
        backgroundColor: isElementSelected ? 'customPalette.secondary' : 'customPalette.surface',
        width: 220,
        height: 30,
        paddingTop: 1,
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <Typography
        sx={{
          color: isElementSelected ? 'customPalette.onSecondary' : 'customPalette.onSurface',
          fontWeight: 'bold',
          position: 'absolute',
          left: 20,
        }}
      >
        {props.name}
      </Typography>
    </Paper>
  );
};
