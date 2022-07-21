import { Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../store';
import { DeleteMenu } from '../../../../../components/DeleteMenu/DeleteMenu';
import { Schema } from '../../../../codexSlice';
import { setCurrentSchema } from '../../../../codexViewSlice';

type SchemaListElementProps = {
  schema: Schema;
  setSchemaId: (newSchemaId: string) => void;
  setIsOpen: (newIsOpen: boolean) => void;
  setSnackbarError: (message: string) => void;
};

export const SchemasListElement: React.FC<SchemaListElementProps> = props => {
  const dispatch = useDispatch();
  const { currentSchema } = useSelector((state: RootState) => state.codexView);
  const { entries } = useSelector((state: RootState) => state.codex);

  const [isElementSelected, setIsElementSelected] = useState<boolean>(
    props.schema.id === currentSchema?.id
  );
  const [menuPos, setMenuPos] = useState<null | { mouseX: number; mouseY: number }>(null);

  useEffect(() => {
    setIsElementSelected(props.schema.id === currentSchema?.id);
  }, [currentSchema, props.schema]);

  const onClick = () => {
    dispatch(setCurrentSchema({ newSchema: props.schema }));
    setIsElementSelected(true);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(setCurrentSchema({ newSchema: props.schema }));
    setMenuPos(
      menuPos === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : null
    );
  };

  const handleDelete = () => {
    if (!entries[props.schema.id].length) {
      props.setSchemaId(props.schema.id);
      props.setIsOpen(true);
      setMenuPos(null);
    } else props.setSnackbarError("Can't remove a schema with entries.");
  };

  const handleClose = () => {
    setMenuPos(null);
  };

  return (
    <Paper
      square
      elevation={0}
      onClick={onClick}
      sx={{
        backgroundColor: isElementSelected ? 'customPalette.accent' : 'transparent',
        width: '100%',
        minHeight: 33,
        height: 33,
        borderRadius: '0px 50px 50px 0px',
        marginTop: 0.3,
        marginBottom: 0.2,
        marginRight: 2,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
      }}
      onContextMenu={handleContextMenu}
    >
      <Typography
        sx={{
          color: isElementSelected ? 'customPalette.onAccent' : 'customPalette.onPrimary',
          fontSize: 15,
          fontWeight: isElementSelected ? 'bold' : 'medium',
          marginLeft: isElementSelected ? 4 : 3.5,
          '&:hover': {
            opacity: 0.85,
          },
        }}
      >
        {props.schema.title}
      </Typography>
      <DeleteMenu menuPos={menuPos} handleDelete={handleDelete} handleClose={handleClose} />
    </Paper>
  );
};
