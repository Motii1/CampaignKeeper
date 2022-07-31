import { Paper, Typography } from '@mui/material';

type SecondaryNavBarButtonProps = {
  text: string;
  isChosen: boolean;
  isDisplayed: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

/**
 * Component used as button for all secondary views (Map, Explorer, Codex),
 * is accented when its view is selected, moves user to its view on click.
 * Hidden unless user has selected CampaignView or one of secondary views
 * @param props
 * @returns
 */
export const SecondaryNavBarButton: React.FC<SecondaryNavBarButtonProps> = props => {
  const outerPaperStyle = {
    backgroundColor: 'customPalette.primary',
    height: 50,
    display: props.isDisplayed ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
  };
  if (props.isChosen)
    return (
      <Paper elevation={0} sx={outerPaperStyle} onClick={props.onClick} square>
        <Paper
          elevation={0}
          sx={{
            backgroundColor: 'customPalette.accent',
            borderRadius: 5,
            height: 35,
            marginLeft: 1,
            marginRight: 1,
            paddingLeft: 1.5,
            paddingRight: 1.5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              cursor: 'pointer',
              color: 'customPalette.onAccent',
              letterSpacing: -0.15,
              fontWeight: 'bold',
              fontSize: 17,
              paddingTop: 0.2,
            }}
          >
            {props.text}
          </Typography>
        </Paper>
      </Paper>
    );
  return (
    <Paper elevation={0} sx={outerPaperStyle} onClick={props.onClick} square>
      <Typography
        variant="h6"
        sx={{
          cursor: 'pointer',
          color: 'customPalette.onPrimary',
          paddingLeft: 2.5,
          paddingRight: 2.5,
          fontWeight: 'medium',
          fontSize: 17,
        }}
      >
        {props.text}
      </Typography>
    </Paper>
  );
};
