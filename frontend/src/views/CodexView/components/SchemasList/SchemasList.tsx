import { Box, Paper, Stack } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { NewSchemaButton } from './components/NewSchemaButton/NewSchemaButton';
import { NewSchemaDialog } from './components/NewSchemaDialog/NewSchemaDialog';
import { SchemasListElement } from './components/SchemasListElement/SchemasListElement';
import { SchemasListHeader } from './components/SchemasListHeader/SchemasListHeader';

export const SchemasList: React.FC = () => {
  const { schemas } = useSelector((state: RootState) => state.codex);

  const [isOpen, setIsOpen] = useState(false);

  const renderSchemaElements = () =>
    schemas.map(schema => <SchemasListElement schema={schema} key={schema.id} />);

  return (
    <Box>
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
          <Paper
            elevation={0}
            square={true}
            sx={{
              backgroundColor: 'transparent',
              height: '100%',
              width: '100%',
              overflowY: 'auto',
            }}
          >
            <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
              spacing={0}
              sx={{
                width: '100%',
              }}
            >
              {renderSchemaElements()}
            </Stack>
          </Paper>
          <NewSchemaButton setIsOpen={setIsOpen} />
        </Stack>
      </Paper>
      <NewSchemaDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </Box>
  );
};
