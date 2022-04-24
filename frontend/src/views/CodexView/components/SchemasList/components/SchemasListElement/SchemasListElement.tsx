import { Paper, Typography } from '@mui/material';

type SchemaListElementProps = {
  isSelected: boolean;
  name: string;
  onClick?: () => void; // remove ? after API integration
};

export const SchemasListElement: React.FC<SchemaListElementProps> = props => (
  <Paper
    square
    elevation={0}
    sx={{
      backgroundColor: props.isSelected
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
        color: props.isSelected ? 'customPalette.onSchemaInstanceColor' : 'customPalette.onSurface',
        fontWeight: 'bold',
        position: 'absolute',
        left: 20,
      }}
    >
      {props.name}
    </Typography>
  </Paper>
);
