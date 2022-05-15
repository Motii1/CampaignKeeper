import { EventInsertDto } from '../../../../Application/Controller/EventController/Dto/EventInsertDto';
import { ErrorWrapper } from '../../../../Common/Type/ErrorWrapper';
import { Event } from '../Event';

export const createEvent = async (dto: EventInsertDto): Promise<Event> => {
  // @todo
};

export class CreateEventError extends ErrorWrapper {}
