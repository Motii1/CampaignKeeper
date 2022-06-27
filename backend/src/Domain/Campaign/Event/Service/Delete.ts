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

  if (!dto.parentId) {
    throw new DeleteEventError(
      'New parent id must be provided for deletion of events that have children!'
    );
  }

  let newParent: Event | null = null;
  try {
    newParent = await validateNewParentAndLoad(dto.parentId, session);
  } catch (error) {
    throw new DeleteEventError((error as Error).message);
  }
  const { children: newParentChildren } = await findRelatedEvents(newParent.id);
  await saveEvent({ ...newParent, children: [...newParentChildren, ...children] } as Event);
  await saveEvent({ ...eventToDelete, children: [] });
  await deleteEventById(eventToDelete.id);
};

const validateNewParentAndLoad = async (id: number, session: Session): Promise<Event> => {
  // @todo extend validation
  const parent = await validateEventExistenceWithLoad(id, session);
  return parent;
};

export class DeleteEventError extends ErrorWrapper {}
