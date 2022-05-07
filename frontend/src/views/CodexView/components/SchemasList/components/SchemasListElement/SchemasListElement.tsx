import { Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../store';
import { Schema } from '../../../../codexSlice';
import { setCurrentEntry, setCurrentSchema } from '../../../../codexViewSlice';

type SchemaListElementProps = {
  schema: Schema;
};

export const SchemasListElement: React.FC<SchemaListElementProps> = props => {
  const dispatch = useDispatch();
  const { currentSchema } = useSelector((state: RootState) => state.codexView);
  const [isElementSelected, setIsElementSelected] = useState<boolean>(
    props.schema.id === currentSchema?.id
  );

  useEffect(() => {
    setIsElementSelected(props.schema.id === currentSchema?.id);
  }, [currentSchema, props.schema]);

  const onClick = () => {
    dispatch(setCurrentSchema({ newSchema: props.schema }));
    dispatch(setCurrentEntry({ newEntry: null }));
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
        {props.schema.title}
      </Typography>
    </Paper>
  );
};
