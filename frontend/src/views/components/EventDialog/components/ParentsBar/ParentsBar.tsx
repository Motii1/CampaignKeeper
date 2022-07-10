import AddIcon from '@mui/icons-material/Add';
import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { AddParentDialog } from './components/AddParentDialog/AddParentDialog';

type ParentsBarProps = {
  currentEventId: string;
  parents: string[];
  setParents: (newParents: string[]) => void;
};

export const ParentsBar: React.FC<ParentsBarProps> = props => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box>
      <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={0}>
        <Typography variant="subtitle1" sx={{ color: 'customPalette.onSurface', paddingLeft: 1 }}>
          Parents
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
      <AddParentDialog
        currentEventId={props.currentEventId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        parents={props.parents}
        setParents={props.setParents}
      />
    </Box>
  );
};
