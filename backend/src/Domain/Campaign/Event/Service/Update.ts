import { EventUpdateDto } from '../../../../Application/Controller/EventController/Dto/EventUpdateDto';
import { ErrorWrapper } from '../../../../Common/Type/ErrorWrapper';
import {
  findRelatedEvents,
  saveEvent,
} from '../../../../Infrastracture/Entity/Event/EventRepository';
import { User } from '../../../User/User';
import { Session } from '../../Session/Session';
import { Event } from '../Event';
import { validateRelatedEventsWithLoad, validateTextFieldMetadata } from './Validate';

export const updateEvent = async (
  dto: EventUpdateDto,
  event: Event,
  session: Session,
  user: User
): Promise<Event> => {
  const toUpdate: Event = { ...event };
  try {
    if (dto.parentIds?.includes(event.id)) {
      throw new Error('Event cannot be parent of itself!');
    }

    if (dto.parentIds) {
      const parents = await validateRelatedEventsWithLoad(dto.parentIds, session);
      toUpdate.parents = parents;
    }

    if (dto.displayStatus) {
      toUpdate.displayStatus = dto.displayStatus;
    }

    if (dto.type) {
      toUpdate.type = dto.type;
    }

    if (dto.title) {
      toUpdate.title = dto.title;
    }

    if (dto.status) {
      toUpdate.status = dto.status;
    }

    if (dto.descriptionMetadataArray) {
      await validateTextFieldMetadata(dto.descriptionMetadataArray, user);
      toUpdate.descriptionMetadataArray = dto.descriptionMetadataArray;
    }

    if (dto.charactersMetadataArray) {
      await validateTextFieldMetadata(dto.charactersMetadataArray, user);
      toUpdate.charactersMetadataArray = dto.charactersMetadataArray;
    }

    if (dto.placeMetadataArray) {
      await validateTextFieldMetadata(dto.placeMetadataArray, user);
      toUpdate.placeMetadataArray = dto.placeMetadataArray;
    }
  } catch (error) {
    throw new UpdateEventError((error as Error).message);
  }
  // @todo validate graph structure
  const savedEvent = await saveEvent(toUpdate);
  const relatedEvents = await findRelatedEvents(savedEvent.id);
  return { ...savedEvent, children: relatedEvents.children, parents: relatedEvents.parents };
};

export class UpdateEventError extends ErrorWrapper {}
