import { Paper, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { getWindowDimensions } from '../../../../utils/utils';
import { NewSchemaButton } from './components/NewSchemaButton/NewSchemaButton';
import { SchemasListElement } from './components/SchemasListElement/SchemasListElement';
import { SchemasListHeader } from './components/SchemasListHeader/SchemasListHeader';

export const SchemasList: React.FC = () => {
  const { schemas } = useSelector((state: RootState) => state.codexView);

  const height = getWindowDimensions().height - 50;

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
        width: 250,
        display: 'flex',
        height: height,
      }}
    >
      <Stack direction="column" justifyContent="flex-start" alignItems="center" spacing={0}>
        <SchemasListHeader />
        {renderSchemaElements()}
        <NewSchemaButton />
      </Stack>
    </Paper>
  );
};
