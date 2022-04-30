import { Paper, Stack, Typography } from '@mui/material';
import { EmptyPlaceholder } from '../../../../../components/EmptyPlaceholder/EmptyPlaceholder';
import { CustomObject } from '../../../../codexViewSlice';
import { ObjectInstance } from './components/ObjectInstance/ObjectInstance';

type ObjectsListProps = {
  title: string;
  objectsToRender: CustomObject[];
};

export const ObjectsList: React.FC<ObjectsListProps> = props =>
  props.objectsToRender.length > 0 ? (
    <Paper
      elevation={6}
      sx={{
        backgroundColor: 'customPalette.surface',
        width: '100%',
      }}
    >
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1.5}
        sx={{ margin: '20px' }}
      >
        <Typography variant={'h4'} sx={{ color: 'customPalette.accent' }}>
          {props.title}
        </Typography>
        <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
          {props.objectsToRender.map(customObject => (
            <ObjectInstance
              name={customObject.title}
              objectId={customObject.id}
              key={customObject.id}
            />
          ))}
        </Stack>
      </Stack>
    </Paper>
  ) : (
    <EmptyPlaceholder message={'Create an object for schema, Creator'} />
  );
