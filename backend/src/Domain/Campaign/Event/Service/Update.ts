import { EventUpdateDto } from '../../../../Application/Controller/EventController/Dto/EventUpdateDto';
import { ErrorWrapper } from '../../../../Common/Type/ErrorWrapper';

export const updateEvent = (dto: EventUpdateDto): Promise<void> => {
  // @todo
};

export class UpdateEventError extends ErrorWrapper {}
