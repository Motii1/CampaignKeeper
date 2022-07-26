import { Box } from '@mui/material';
import { EventArrowProps } from '../EventArrow';

/**
 * Mock for EventArrow component, used to allow testing with Jest library
 * as well as simplify checking if arrows has been rendered correctly during tests
 * @param props
 * @returns
 */
export const EventArrow: React.FC<EventArrowProps> = props => (
  <Box>{`${props.start}-${props.end}`}</Box>
);
