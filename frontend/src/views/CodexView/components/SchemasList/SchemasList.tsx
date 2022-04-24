import { Paper, Stack } from '@mui/material';
import { getWindowDimensions } from '../../../../utils/utils';
import { NewSchemaButton } from './components/NewSchemaButton/NewSchemaButton';
import { SchemasListElement } from './components/SchemasListElement/SchemasListElement';
import { SchemasListHeader } from './components/SchemasListHeader/SchemasListHeader';

export const SchemasList: React.FC = () => {
  const height = getWindowDimensions().height - 50;

  const mockSchemas = [
    { name: 'NPC', isSelected: false },
    { name: 'City', isSelected: true },
    { name: 'Item', isSelected: false },
  ];

  const rednderSchemaElements = () =>
    mockSchemas.map(_position => (
      <SchemasListElement
        name={_position.name}
        isSelected={_position.isSelected}
        key={_position.name}
      />
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
        {rednderSchemaElements()}
        <NewSchemaButton />
      </Stack>
    </Paper>
  );
};
