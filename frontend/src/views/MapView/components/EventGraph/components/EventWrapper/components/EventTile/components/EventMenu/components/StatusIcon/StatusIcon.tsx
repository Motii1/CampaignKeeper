import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import { Tooltip } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import requestMethods from '../../../../../../../../../../../../axios/requestMethods';
import { useQuery } from '../../../../../../../../../../../../axios/useQuery';
import { EditEventData } from '../../../../../../../../../../dialog/MapDialog';
import { changeEventStatus, SessionEventWithPos } from '../../../../../../../../../../eventsSlice';

type StatusIconProps = {
  event: SessionEventWithPos;
};

export const StatusIcon: React.FC<StatusIconProps> = props => {
  const dispatch = useDispatch();

  // const [eventStatus, setEventStatus] = useState(props.event.status);

  const getNewStatus = useCallback(() => {
    if (props.event.status === 'none') return 'done';
    else if (props.event.status === 'done') return 'omitted';
    return 'none';
  }, [props.event.status]);

  const {
    isLoading: isLoadingStatus,
    status: statusStatus,
    runQuery: runQueryStatus,
    resetQuery: resetQueryStatus,
  } = useQuery<EditEventData>(`/api/event/${props.event.id}`, requestMethods.PATCH);

  const handleRunQueryStatus = useCallback(() => {
    if (!isLoadingStatus && statusStatus) {
      if (statusStatus === 200)
        dispatch(
          changeEventStatus({
            changedEventId: props.event.id,
            newStatus: getNewStatus(),
          })
        );
      resetQueryStatus();
    }
  }, [dispatch, getNewStatus, isLoadingStatus, props.event.id, resetQueryStatus, statusStatus]);

  useEffect(() => {
    handleRunQueryStatus();
  }, [handleRunQueryStatus]);

  const handleClick = () => {
    if (props.event.status === 'none')
      runQueryStatus({
        status: 'done',
      });
    else if (props.event.status === 'done')
      runQueryStatus({
        status: 'omitted',
      });
    else
      runQueryStatus({
        status: 'none',
      });
  };

  if (props.event.status === 'none')
    return (
      <Tooltip title="Change event status to done">
        <CheckBoxOutlineBlankOutlinedIcon
          fontSize="small"
          onClick={handleClick}
          sx={{ color: 'customPalette.onAccent', opacity: '0.8', cursor: 'pointer' }}
        />
      </Tooltip>
    );
  if (props.event.status === 'done')
    return (
      <Tooltip title="Change event status to omitted">
        <CheckBoxOutlinedIcon
          fontSize="small"
          onClick={handleClick}
          sx={{ color: 'customPalette.onAccent', opacity: '0.8', cursor: 'pointer' }}
        />
      </Tooltip>
    );
  else
    return (
      <Tooltip title="Change event status to none">
        <IndeterminateCheckBoxOutlinedIcon
          fontSize="small"
          onClick={handleClick}
          sx={{ color: 'customPalette.onAccent', opacity: '0.8', cursor: 'pointer' }}
        />
      </Tooltip>
    );
};
