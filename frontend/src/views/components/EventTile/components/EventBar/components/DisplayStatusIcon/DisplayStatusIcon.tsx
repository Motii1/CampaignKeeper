import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Tooltip } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import requestMethods from '../../../../../../../axios/requestMethods';
import { useQuery } from '../../../../../../../axios/useQuery';
import { hideEvent, SessionEventWithPos, showEvent } from '../../../../../../MapView/eventsSlice';
import { EditEventData } from '../../../../../EventDialog/EventDialog';

type DisplayStatusIconProps = {
  event: SessionEventWithPos;
};

/**
 * Icon serving as button for changing event display status (hiding and showing event),
 * changes status from one to another on click
 * @param props
 * @returns
 */
export const DisplayStatusIcon: React.FC<DisplayStatusIconProps> = props => {
  const dispatch = useDispatch();

  const [displayStatus, setDisplayStatus] = useState(props.event.displayStatus);

  const {
    isLoading: isLoadingStatus,
    status: statusStatus,
    runQuery: runQueryStatus,
    resetQuery: resetQueryStatus,
  } = useQuery<EditEventData>(`/api/event/${props.event.id}`, requestMethods.PATCH);

  const handleRunQueryStatus = useCallback(() => {
    if (!isLoadingStatus && statusStatus) {
      if (statusStatus === 200)
        if (displayStatus === 'hidden')
          dispatch(
            hideEvent({
              id: props.event.id,
            })
          );
        else
          dispatch(
            showEvent({
              id: props.event.id,
            })
          );
      resetQueryStatus();
    }
  }, [dispatch, displayStatus, isLoadingStatus, props.event, resetQueryStatus, statusStatus]);

  useEffect(() => {
    handleRunQueryStatus();
  }, [handleRunQueryStatus]);

  const handleClick = () => {
    const newDisplayStatus = displayStatus === 'shown' ? 'hidden' : 'shown';
    runQueryStatus({
      displayStatus: newDisplayStatus,
    });
    setDisplayStatus(newDisplayStatus);
  };

  if (displayStatus === 'shown')
    return (
      <Tooltip title="Collapse event">
        <VisibilityOutlinedIcon
          fontSize="small"
          onClick={handleClick}
          sx={{ color: 'customPalette.onAccent', opacity: '0.8', cursor: 'pointer' }}
        />
      </Tooltip>
    );

  return (
    <Tooltip title="Expand event">
      <VisibilityOffOutlinedIcon
        fontSize="small"
        onClick={handleClick}
        sx={{ color: 'customPalette.onAccent', opacity: '0.8', cursor: 'pointer' }}
      />
    </Tooltip>
  );
};
