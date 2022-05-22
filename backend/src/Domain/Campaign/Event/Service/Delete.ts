import { EventDeleteDto } from '../../../../Application/Controller/EventController/Dto/EventDeleteDto';
import { ErrorWrapper } from '../../../../Common/Type/ErrorWrapper';
import {
  deleteEventById,
  findRelatedEvents,
  saveEvent,
} from '../../../../Infrastracture/Entity/Event/EventRepository';
import { Session } from '../../Session/Session';
import { Event } from '../Event';
import { validateEventExistenceWithLoad } from './Validate';

export const deleteEvent = async (
  eventToDelete: Event,
  dto: EventDeleteDto,
  session: Session
): Promise<void> => {
  const { children, parents } = await findRelatedEvents(eventToDelete.id);
  if (parents.length === 0 && children.length > 0) {
    throw new DeleteEventError('Cannot delete root with existing children');
  }

  if (children.length === 0) {
    return await deleteEventById(eventToDelete.id);
  }

  let newParent: Event | null = null;
  try {
    newParent = dto.parentId ? await validateNewParentAndLoad(dto.parentId, session) : null;
  } catch (error) {
    throw new DeleteEventError((error as Error).message);
  }

  if (dto.parentId) {
    await saveEvent({ ...newParent, children } as Event);
  }
  await deleteEventById(eventToDelete.id);
};

const validateNewParentAndLoad = async (id: number, session: Session): Promise<Event> => {
  // @todo extend validation
  const parent = await validateEventExistenceWithLoad(id, session);
  return parent;
};

export class DeleteEventError extends ErrorWrapper {}
