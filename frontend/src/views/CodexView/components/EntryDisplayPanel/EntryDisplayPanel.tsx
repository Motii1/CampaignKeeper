import { CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';

export const EntryDisplayPanel: React.FC = () => {
  const { currentEntry } = useSelector((state: RootState) => state.codexView);

  // TO-DO move to utils during edit object dialog implementation
  // const renderObjectFields = () => {
  //   if (currentObject)
  //     return currentObject.metadataArray.map(field => (
  //       <Box key={field.toString}>
  //         <Typography>{field.toString}</Typography>
  //       </Box>
  //     ));
  //   return null;
  // };

  return currentEntry ? (
    <Paper
      elevation={6}
      sx={{
        backgroundColor: 'customPalette.surface',
        width: '60%',
        height: '100%',
        marginLeft: '20%',
        marginRight: '20%',
        marginTop: '10%',
        marginBottom: '10%',
      }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={1}
        sx={{ marginLeft: '2%' }}
      >
        <Typography variant={'h4'} sx={{ color: 'customPalette.accent', marginTop: '2%' }}>
          {currentEntry.title}
        </Typography>
        {/* {renderObjectFields()} */}
      </Stack>
    </Paper>
  ) : (
    <CircularProgress size={35} thickness={6} sx={{ color: 'customPalette.accent' }} />
  );
};
