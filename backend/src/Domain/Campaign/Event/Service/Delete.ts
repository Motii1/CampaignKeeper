import { EventDeleteDto } from '../../../../Application/Controller/EventController/Dto/EventDeleteDto';
import { ErrorWrapper } from '../../../../Common/Type/ErrorWrapper';

export const deleteEvent = async (dto: EventDeleteDto): Promise<void> => {
  // @todo
};

export class DeleteEventError extends ErrorWrapper {}
