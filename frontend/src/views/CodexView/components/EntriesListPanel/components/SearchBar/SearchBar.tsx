import SearchIcon from '@mui/icons-material/Search';
import { Paper, Stack, TextField } from '@mui/material';

type SearchBarProps = {
  setSearchPhrase: (newSearchPhrase: string) => void;
};

export const SearchBar: React.FC<SearchBarProps> = props => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setSearchPhrase(event.target.value);
  };

  return (
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
          onChange={onChange}
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
};
