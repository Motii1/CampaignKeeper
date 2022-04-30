import SearchIcon from '@mui/icons-material/Search';
import { Paper, Stack, TextField } from '@mui/material';

// TO-DO: TextField shouldn't have
export const SearchBar: React.FC = () => (
  <Paper
    elevation={6}
    sx={{
      backgroundColor: 'customPalette.surface',
      width: '100%',
    }}
  >
    <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={0}>
      <SearchIcon sx={{ marginLeft: '1%' }} />
      <TextField
        placeholder="Search"
        sx={{
          width: '100%',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: 'transparent',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'transparent',
            },
          },
        }}
      />
    </Stack>
  </Paper>
);
