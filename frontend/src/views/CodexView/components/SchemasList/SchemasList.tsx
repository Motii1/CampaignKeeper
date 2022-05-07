import { Paper, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { NewSchemaButton } from './components/NewSchemaButton/NewSchemaButton';
import { SchemasListElement } from './components/SchemasListElement/SchemasListElement';
import { SchemasListHeader } from './components/SchemasListHeader/SchemasListHeader';

type SchemasListProps = {
  setIsOpen: (newIsOpen: boolean) => void;
};

export const SchemasList: React.FC<SchemasListProps> = props => {
  const { schemas } = useSelector((state: RootState) => state.codex);

  const renderSchemaElements = () =>
    schemas.map(schema => (
      <SchemasListElement name={schema.title} schemaId={schema.id} key={schema.id} />
    ));

  return (
    <Paper
      elevation={6}
      square
      sx={{
        backgroundColor: 'customPalette.surface',
        position: 'absolute',
        left: 0,
        top: 50,
        bottom: 0,
        width: 220,
        display: 'flex',
      }}
    >
      <Stack direction="column" justifyContent="flex-start" alignItems="center" spacing={0}>
        <SchemasListHeader />
        {renderSchemaElements()}
        <NewSchemaButton setIsOpen={props.setIsOpen} />
      </Stack>
    </Paper>
  );
};
