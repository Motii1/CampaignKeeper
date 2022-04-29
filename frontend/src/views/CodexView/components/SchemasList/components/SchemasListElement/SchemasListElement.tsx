import { Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../store';
import { updateCurrentSchemaId } from '../../../../codexViewSlice';

type SchemaListElementProps = {
  name: string;
  schemaId: string;
};

export const SchemasListElement: React.FC<SchemaListElementProps> = props => {
  const dispatch = useDispatch();
  const { currentSchemaId } = useSelector((state: RootState) => state.codexView);
  const [isElementSelected, setIsElementSelected] = useState<boolean>(
    props.schemaId === currentSchemaId
  );

  const onClick = () => {
    dispatch(updateCurrentSchemaId({ currentSchemaId: props.schemaId }));
    setIsElementSelected(true);
  };

  useEffect(() => {
    setIsElementSelected(props.schemaId === currentSchemaId);
  }, [props.schemaId, currentSchemaId]);

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
