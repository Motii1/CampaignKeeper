import { Stack, Typography } from '@mui/material';
import { CustomButton } from '../../../../components/CustomButton/CustomButton';

type ChangeFormComponentProps = {
  firstLineText: string;
  secondLineText: string;
  buttonText: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const ChangeFormComponent: React.FC<ChangeFormComponentProps> = props => (
  <Stack
    direction="column"
    justifyContent="flex-start"
    alignItems="flex-end"
    spacing={0.5}
    onSubmit={props.onSubmit}
    component="form"
    sx={{ width: '100%' }}
  >
    <Typography
      variant="subtitle2"
      sx={{
        color: 'customPalette.onSurface',
        textAlign: 'right',
        fontWeight: 'regular',
      }}
    >
      {props.firstLineText}
      <br />
      {props.secondLineText}
    </Typography>
    <CustomButton text={props.buttonText} />
  </Stack>
);
