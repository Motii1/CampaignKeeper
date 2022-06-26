import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import requestMethods from '../../../../../../../../../../../../axios/requestMethods';
import { useQuery } from '../../../../../../../../../../../../axios/useQuery';
import { EditEventData } from '../../../../../../../../../../dialog/MapDialog';
import { editEvent, SessionEventWithPos } from '../../../../../../../../../../eventsSlice';

type StatusIconProps = {
  event: SessionEventWithPos;
};

export const StatusIcon: React.FC<StatusIconProps> = props => {
  const dispatch = useDispatch();

  const [eventStatus, setEventStatus] = useState(props.event.status);

  const setNewStatus = () => {
    if (eventStatus === 'none') setEventStatus('done');
    else if (eventStatus === 'done') setEventStatus('omitted');
    else setEventStatus('none');
  };

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
          editEvent({
            updatedEvent: { ...props.event, status: eventStatus },
          })
        );
      resetQueryStatus();
    }
  }, [dispatch, eventStatus, isLoadingStatus, props.event, resetQueryStatus, statusStatus]);

  useEffect(() => {
    handleRunQueryStatus();
  }, [handleRunQueryStatus]);

  // eslint-disable-next-line no-console
  const handleClick = () => {
    setNewStatus();
    runQueryStatus({
      title: props.event.title,
      type: props.event.type,
      status: eventStatus,
      displayStatus: props.event.displayStatus,
      placeMetadataArray: props.event.placeMetadataArray,
      descriptionMetadataArray: props.event.descriptionMetadataArray,
      charactersMetadataArray: props.event.charactersMetadataArray,
      parentIds: props.event.parentIds,
    });
  };

  if (eventStatus === 'none')
    return (
      <CheckBoxOutlineBlankOutlinedIcon
        fontSize="small"
        onClick={handleClick}
        sx={{ color: 'customPalette.onAccent', opacity: '0.8', cursor: 'pointer' }}
      />
    );
  if (eventStatus === 'done')
    return (
      <CheckBoxOutlinedIcon
        fontSize="small"
        onClick={handleClick}
        sx={{ color: 'customPalette.onAccent', opacity: '0.8', cursor: 'pointer' }}
      />
    );
  else
    return (
      <IndeterminateCheckBoxOutlinedIcon
        fontSize="small"
        onClick={handleClick}
        sx={{ color: 'customPalette.onAccent', opacity: '0.8', cursor: 'pointer' }}
      />
    );
};
