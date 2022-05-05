import AddIcon from '@mui/icons-material/Add';
import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { AddFieldDialog } from './components/AddFieldDialog/AddFieldDialog';

type FieldsBarProps = {
  fields: string[];
  setFields: (newFields: string[]) => void;
};

export const FieldsBar: React.FC<FieldsBarProps> = props => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box>
      <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={0}>
        <Typography variant="subtitle1" sx={{ color: 'customPalette.onSurface', paddingLeft: 1 }}>
          Fields
        </Typography>
        <AddIcon
          sx={{
            cursor: 'pointer',
            color: 'customPalette.onSurface',
            height: 22,
          }}
          onClick={() => setIsOpen(true)}
        />
      </Stack>
      <AddFieldDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        fields={props.fields}
        setFields={props.setFields}
      />
    </Box>
  );
};
