import { Add, Delete, ModeEdit, QuestionMark, Save } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { FabIcon } from '../../../types/types';

type FabContentWrapperProps = {
  text: string;
  icon: FabIcon;
};

/**
 * Component serving as wrapper on FABs from views,
 * adds icon to FAB text to simplify control of icons in FABs
 * @param props
 * @returns
 */
export const FabContentWrapper: React.FC<FabContentWrapperProps> = props => {
  const renderIcon = () => {
    switch (props.icon) {
      case FabIcon.Add:
        return <Add />;
      case FabIcon.Save:
        return <Save />;
      case FabIcon.Delete:
        return <Delete />;
      case FabIcon.Edit:
        return <ModeEdit />;
      default:
        return <QuestionMark />;
    }
  };

  return (
    <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
      {renderIcon()}
      <Typography
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          height: '100%',
          display: 'inline-block',
          verticalAlign: 'middle',
          lineHeight: 'normal',
        }}
      >
        {props.text}
      </Typography>
    </Stack>
  );
};
