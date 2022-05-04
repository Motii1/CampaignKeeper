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
        borderRadius: 3.5,
        width: '100%',
        height: 45,
      }}
    >
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={0}
        sx={{
          height: '100%',
        }}
      >
        <SearchIcon sx={{ marginLeft: 2, opacity: 0.75 }} />
        <TextField
          placeholder="Search"
          onChange={onChange}
          size="small"
          inputProps={{
            sx: {
              '&::placeholder': {
                color: 'customPalette.onBackground',
                opacity: 0.75,
              },
              '&::-ms-reveal': {
                filter: 'invert(100%)',
              },
              '&': {
                fontSize: 17,
                fontWeight: 'light',
              },
            },
          }}
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
