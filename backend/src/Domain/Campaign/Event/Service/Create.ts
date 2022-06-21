import { EventInsertDto } from '../../../../Application/Controller/EventController/Dto/EventInsertDto';
import { ErrorWrapper } from '../../../../Common/Type/ErrorWrapper';
import { saveEvent } from '../../../../Infrastracture/Entity/Event/EventRepository';
import { User } from '../../../User/User';
import { Session } from '../../Session/Session';
import { Event, EventDisplayStatus } from '../Event';
import { validateRelatedEventsWithLoad, validateTextFields } from './Validate';

export const createEvent = async (
  dto: EventInsertDto,
  session: Session,
  user: User
): Promise<Event> => {
  let parents: Event[] = [];
  try {
    // @todo validate graph structure
    parents = await validateRelatedEventsWithLoad(dto.parentIds, session);
    await validateTextFields(dto, user);
  } catch (error) {
    throw new CreateEventError((error as Error).message);
  }

  const event: Omit<Event, 'id'> = {
    status: dto.status,
    type: dto.type,
    title: dto.title,
    charactersMetadataArray: dto.charactersMetadataArray,
    descriptionMetadataArray: dto.descriptionMetadataArray,
    placeMetadataArray: dto.placeMetadataArray,
    sessionId: dto.sessionId,
    parents,
    displayStatus: EventDisplayStatus.Shown,
  };
  const savedEvent = await saveEvent(event);
  return { ...savedEvent, children: [], parents };
};

export class CreateEventError extends ErrorWrapper {}
