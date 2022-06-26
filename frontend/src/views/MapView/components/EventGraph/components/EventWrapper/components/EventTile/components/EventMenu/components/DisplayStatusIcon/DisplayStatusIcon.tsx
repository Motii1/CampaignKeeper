import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import requestMethods from '../../../../../../../../../../../../axios/requestMethods';
import { useQuery } from '../../../../../../../../../../../../axios/useQuery';
import { EditEventData } from '../../../../../../../../../../dialog/MapDialog';
import { editEvent, SessionEventWithPos } from '../../../../../../../../../../eventsSlice';

type DisplayStatusIconProps = {
  event: SessionEventWithPos;
};

export const DisplayStatusIcon: React.FC<DisplayStatusIconProps> = props => {
  const dispatch = useDispatch();

  const [displayStatus, setDisplayStatus] = useState(props.event.displayStatus);

  const setNewStatus = () => {
    if (displayStatus === 'shown') setDisplayStatus('collapsed');
    else setDisplayStatus('shown');
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
            updatedEvent: { ...props.event, displayStatus: displayStatus },
          })
        );
      resetQueryStatus();
    }
  }, [dispatch, displayStatus, isLoadingStatus, props.event, resetQueryStatus, statusStatus]);

  useEffect(() => {
    handleRunQueryStatus();
  }, [handleRunQueryStatus]);

  const handleClick = () => {
    setNewStatus();
    runQueryStatus({
      title: props.event.title,
      type: props.event.type,
      status: props.event.status,
      displayStatus: displayStatus,
      placeMetadataArray: props.event.placeMetadataArray,
      descriptionMetadataArray: props.event.descriptionMetadataArray,
      charactersMetadataArray: props.event.charactersMetadataArray,
      parentIds: props.event.parentIds,
    });
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
