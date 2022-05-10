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
    schemas.map(schema => <SchemasListElement schema={schema} key={schema.id} />);

  return (
    <Paper
      elevation={6}
      square
      sx={{
        backgroundColor: 'customPalette.surface',
        position: 'absolute',
        left: 0,
        top: '50px',
        bottom: 0,
        height: 'calc(100vh - 50px)',
        width: 220,
      }}
    >
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={0}
        sx={{
          height: '100%',
          width: '100%',
        }}
      >
        <SchemasListHeader />
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          spacing={0}
          sx={{
            height: '100%',
            width: '100%',
            overflowY: 'auto',
          }}
        >
          {renderSchemaElements()}
        </Stack>
        <NewSchemaButton setIsOpen={props.setIsOpen} />
      </Stack>
    </Paper>
  );
};
