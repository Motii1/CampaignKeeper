import { Event, TextFieldMetadata } from '../../../Domain/Campaign/Event/Event';
import { EventEntity } from './EventEntity';

export const mapEntityToDomainObject = (entity: EventEntity): Event => {
  const event: Event = mapEntityToDomainObjectWithoutGraphRelations(entity) as Event;
  if (entity.parents) {
    event.parents = entity.parents.map(mapEntityToDomainObjectWithoutGraphRelations) as Event[];
  }
  if (entity.children) {
    event.children = entity.children.map(mapEntityToDomainObjectWithoutGraphRelations) as Event[];
  }
  if (entity.charactersMetadataArray) {
    event.charactersMetadataArray = mapTextFieldMetadata(entity.charactersMetadataArray);
  }
  if (entity.placeMetadataArray) {
    event.placeMetadataArray = mapTextFieldMetadata(entity.placeMetadataArray);
  }
  if (entity.descriptionMetadataArray) {
    event.descriptionMetadataArray = mapTextFieldMetadata(entity.descriptionMetadataArray);
  }
  return event;
};

const mapEntityToDomainObjectWithoutGraphRelations = (entity: EventEntity): Partial<Event> => ({
  id: entity.id,
  sessionId: entity.sessionId,
  status: entity.status,
  type: entity.type,
  title: entity.title,
  displayStatus: entity.displayStatus,
});

const mapTextFieldMetadata = (entities: TextFieldMetadataOption): TextFieldMetadata[] =>
  entities.map(entity => ({
    id: entity.id,
    value: entity.value,
    sequenceNumber: entity.sequenceNumber,
    type: entity.type,
  }));

type TextFieldMetadataOption =
  | EventEntity['charactersMetadataArray']
  | EventEntity['placeMetadataArray']
  | EventEntity['descriptionMetadataArray'];
