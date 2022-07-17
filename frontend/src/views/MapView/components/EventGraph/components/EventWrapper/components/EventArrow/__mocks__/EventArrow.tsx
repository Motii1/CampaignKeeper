import { Box } from '@mui/material';
import { EventArrowProps } from '../EventArrow';

export const EventArrow: React.FC<EventArrowProps> = props => (
  <Box>{`${props.start}-${props.end}`}</Box>
);
