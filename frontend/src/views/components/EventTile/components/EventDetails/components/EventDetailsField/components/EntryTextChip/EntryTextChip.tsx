import { Typography } from '@mui/material';

type EntryTextChipProps = {
  title: string;
  isShownInExplorer: undefined | boolean;
};

export const EntryTextChip: React.FC<EntryTextChipProps> = props => (
  <Typography
    noWrap={true}
    variant={props.isShownInExplorer ? 'subtitle2' : 'subtitle1'}
    sx={{
      fontWeight: 'bold',
      color: 'customPalette.background',
      backgroundColor: 'customPalette.onBackground',
      paddingLeft: '6px',
      paddingRight: '6px',
      marginLeft: '2px',
      marginRight: '2px',
      borderRadius: '10px',
      width: 'max-content',
      display: 'inline',
      '&:hover': {
        opacity: 0.9,
      },
    }}
  >
    {props.title}
  </Typography>
);
