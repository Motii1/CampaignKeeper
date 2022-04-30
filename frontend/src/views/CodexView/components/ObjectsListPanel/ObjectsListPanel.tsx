import { CircularProgress, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { EmptyPlaceholder } from '../../../components/EmptyPlaceholder/EmptyPlaceholder';
import { Schema } from '../../codexViewSlice';
import { ObjectsList } from './components/ObjectsList/ObjectsList';
import { SearchBar } from './components/SearchBar/SearchBar';

// TO-DO add method for creating SchemaInstance and SchemaIstance React.FC
// TO-DO add scroll for long list of objects
export const ObjectsListPanel: React.FC = () => {
  const { currentSchemaId, objects, schemas } = useSelector((state: RootState) => state.codexView);

  const [currentlyDisplayedSchema, setCurrentlyDisplayedSchema] = useState<Schema | undefined>(
    schemas.find(schema => schema.id === currentSchemaId)
  );

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  useEffect(() => {
    setCurrentlyDisplayedSchema(schemas.find(schema => schema.id === currentSchemaId));
    // // eslint-disable-next-line no-console
    // console.log(currentSchemaId);
    // // eslint-disable-next-line no-console
    // console.log(JSON.stringify(objects));
  }, [currentSchemaId, schemas]);

  if (currentlyDisplayedSchema)
    return objects[currentlyDisplayedSchema.id] ? (
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={2}
        sx={{
          width: '60%',
          height: '100%',
          marginLeft: '20%',
          marginRight: '20%',
          marginTop: '10%',
          marginBottom: '10%',
        }}
      >
        <SearchBar />
        <ObjectsList
          title={currentlyDisplayedSchema.title}
          objectsToRender={objects[currentlyDisplayedSchema.id]}
        />
      </Stack>
    ) : (
      <CircularProgress size={35} thickness={6} sx={{ color: 'customPalette.accent' }} />
    );
  return <EmptyPlaceholder message={'Select a schema, ye wise sage'} />;
};
