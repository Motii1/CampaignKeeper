import { Paper, Typography } from '@mui/material';

type PrimaryNavBarButtonProps = {
  text: string;
  isChosen: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

export const PrimaryNavBarButton: React.FC<PrimaryNavBarButtonProps> = props => {
  if (props.isChosen)
    return (
      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'customPalette.accent',
          height: 60,
          overflow: 'visible',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={props.onClick}
        square
      >
        <Typography
          variant="h6"
          sx={{
            cursor: 'pointer',
            color: 'customPalette.onAccent',
            paddingLeft: 2,
            paddingRight: 2,
            fontWeight: 'bold',
          }}
        >
          {props.text}
        </Typography>
      </Paper>
    );
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'customPalette.surface',
        height: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={props.onClick}
      square
    >
      <Typography
        variant="h6"
        sx={{
          cursor: 'pointer',
          color: 'customPalette.onSurface',
          paddingLeft: 2,
          paddingRight: 2,
          letterSpacing: 0.21,
          fontWeight: 'medium',
        }}
      >
        {props.text}
      </Typography>
    </Paper>
  );
};
