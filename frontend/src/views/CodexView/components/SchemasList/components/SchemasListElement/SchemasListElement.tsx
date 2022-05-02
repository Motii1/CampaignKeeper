import { Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../store';
import { fetchObjects, updateCurrentSchema } from '../../../../codexViewSlice';

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

  const onClick = () => {
    dispatch(updateCurrentSchema({ newSchemaId: props.schemaId }));
    if (!downloadedSchemas.find(element => element === props.schemaId))
      dispatch(fetchObjects(props.schemaId));

    setIsElementSelected(true);
  };

  useEffect(() => {
    setIsElementSelected(props.schemaId === currentSchema?.id);
  }, [currentSchema?.id, props.schemaId]);

  return (
    <Paper
      square
      elevation={0}
      onClick={onClick}
      sx={{
        backgroundColor: isElementSelected
          ? 'customPalette.schemaInstanceColor'
          : 'customPalette.surface',
        width: 250,
        height: 30,
        paddingTop: 1,
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <Typography
        sx={{
          color: isElementSelected
            ? 'customPalette.onSchemaInstanceColor'
            : 'customPalette.onSurface',
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
