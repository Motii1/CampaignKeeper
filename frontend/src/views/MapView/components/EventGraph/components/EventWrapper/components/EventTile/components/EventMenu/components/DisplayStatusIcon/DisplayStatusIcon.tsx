import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import requestMethods from '../../../../../../../../../../../../axios/requestMethods';
import { useQuery } from '../../../../../../../../../../../../axios/useQuery';
import { EditEventData } from '../../../../../../../../../../dialog/MapDialog';
import {
  collapseEvent,
  SessionEventWithPos,
  uncollapseEvent,
} from '../../../../../../../../../../eventsSlice';

type DisplayStatusIconProps = {
  event: SessionEventWithPos;
};

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
        if (displayStatus === 'collapsed')
          dispatch(
            collapseEvent({
              eventToCollapse: props.event,
            })
          );
        else
          dispatch(
            uncollapseEvent({
              eventToUncollapse: props.event,
            })
          );
      resetQueryStatus();
    }
  }, [dispatch, displayStatus, isLoadingStatus, props.event, resetQueryStatus, statusStatus]);

  useEffect(() => {
    handleRunQueryStatus();
  }, [handleRunQueryStatus]);

  const handleClick = () => {
    const newDisplayStatus = displayStatus === 'shown' ? 'collapsed' : 'shown';
    runQueryStatus({
      displayStatus: newDisplayStatus,
    });
    setDisplayStatus(newDisplayStatus);
  };

  if (displayStatus === 'shown')
    return (
      <VisibilityOutlinedIcon
        fontSize="small"
        onClick={handleClick}
        sx={{ color: 'customPalette.onAccent', opacity: '0.8', cursor: 'pointer' }}
      />
    );

  return (
    <VisibilityOffOutlinedIcon
      fontSize="small"
      onClick={handleClick}
      sx={{ color: 'customPalette.onAccent', opacity: '0.8', cursor: 'pointer' }}
    />
  );
};
