import { EventUpdateDto } from '../../../../Application/Controller/EventController/Dto/EventUpdateDto';
import { ErrorWrapper } from '../../../../Common/Type/ErrorWrapper';
import { saveEvent } from '../../../../Infrastracture/Entity/Event/EventRepository';
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
    if (dto.parentIds) {
      const parents = await validateRelatedEventsWithLoad(dto.parentIds, session);
      toUpdate.parents = parents;
    }

    if (dto.type) {
      event.type = dto.type;
    }

    if (dto.title) {
      event.title = dto.title;
    }

    if (dto.status) {
      event.status = dto.status;
    }

    if (dto.descriptionMetadataArray) {
      await validateTextFieldMetadata(dto.descriptionMetadataArray, user);
      event.descriptionMetadataArray = dto.descriptionMetadataArray;
    }

    if (dto.charactersMetadataArray) {
      await validateTextFieldMetadata(dto.charactersMetadataArray, user);
      event.charactersMetadataArray = dto.charactersMetadataArray;
    }

    if (dto.placeMetadataArray) {
      await validateTextFieldMetadata(dto.placeMetadataArray, user);
      event.placeMetadataArray = dto.placeMetadataArray;
    }
  } catch (error) {
    throw new UpdateEventError((error as Error).message);
  }
  // @todo validate graph structure
  return await saveEvent(toUpdate);
};

export class UpdateEventError extends ErrorWrapper {}
