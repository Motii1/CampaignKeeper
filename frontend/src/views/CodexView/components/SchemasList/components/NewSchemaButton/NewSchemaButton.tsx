import { Add } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import { CustomButtonBehavior, CustomButtonType } from '../../../../../../types/types';
import { CustomButton } from '../../../../../components/CustomButton/CustomButton';

const ButtonContent: React.FC = () => (
  <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
    <Add />
    <Typography
      sx={{ fontWeight: 'bold', textAlign: 'center', paddingTop: 0.5, paddingBottom: 0.5 }}
    >
      New schema
    </Typography>
  </Stack>
);

// add props and onClick after API integration
export const NewSchemaButton: React.FC = () => (
  <Box sx={{ position: 'absolute', bottom: 10 }}>
    <CustomButton
      content={<ButtonContent />}
      behavior={CustomButtonBehavior.Func}
      type={CustomButtonType.Accent}
    />
  </Box>
);
