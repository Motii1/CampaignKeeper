import { findEventById } from '../../../../Infrastracture/Entity/Event/EventRepository';
import { User } from '../../../User/User';
import { validateSingleId } from '../../SchemaInstance/Service/Validate';
import { Session } from '../../Session/Session';
import { Event, TextFieldMetadata, TextFieldType } from '../Event';

export const validateRelatedEventsWithLoad = async (
  ids: number[],
  session: Session
): Promise<Event[]> =>
  await Promise.all(ids.map(id => validateEventExistenceWithLoad(id, session)));

export const validateEventExistenceWithLoad = async (
  id: number,
  session: Session
): Promise<Event> => {
  const event = await findEventById(id);
  if (!event || event.sessionId !== session.id) {
    throw new Error(`Event with ${id} does not exist in the scope of current session!`);
  }
  return event;
};

export const validateTextFields = async (
  dto: Pick<Event, 'placeMetadataArray' | 'charactersMetadataArray' | 'descriptionMetadataArray'>,
  user: User
): Promise<void> => {
  await Promise.all(
    [dto.placeMetadataArray, dto.charactersMetadataArray, dto.descriptionMetadataArray].map(item =>
      validateTextFieldMetadata(item, user)
    )
  );
};

export const validateTextFieldMetadata = async (
  metadata: TextFieldMetadata[],
  user: User
): Promise<void> => {
  validateSequenceNumbers(metadata);
  await validateIds(metadata, user);
};

const validateSequenceNumbers = (metadata: TextFieldMetadata[]): void => {
  const seqNumbers = metadata.map(({ sequenceNumber }) => sequenceNumber);
  const uniqueSequenceNumbers = [...new Set(seqNumbers)];
  if (uniqueSequenceNumbers.length !== seqNumbers.length) {
    throw new Error('Sequence numbers have to be unique!');
  }
  const sorted = seqNumbers.sort();
  const minimum = sorted[0];
  const maximum = sorted[sorted.length - 1];
  if (minimum !== 0 || maximum - minimum !== sorted.length - 1) {
    throw new Error('Sequence numbers have to start at zero and be incremented one by one!');
  }
};

const validateIds = async (metadata: TextFieldMetadata[], user: User): Promise<void> => {
  const possiblyDuplicatedIds = metadata.reduce<number[]>((acc, { type, value }) => {
    if (type !== TextFieldType.id) {
      return acc;
    }
    const id = Number(value);
    if (isNaN(id) || id <= 0) {
      throw new Error(`One of IDs is not a number: ${value}`);
    }
    return [...acc, id];
  }, []);
  const uniqueIds = [...new Set(possiblyDuplicatedIds)];
  await Promise.all(uniqueIds.map(id => validateSingleId(id, user)));
};
