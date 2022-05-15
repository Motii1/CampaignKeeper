import { Event, TextFieldMetadata } from '../../../Domain/Campaign/Event/Event';
import { EventEntity } from './EventEntity';

export const mapEntityToDomainObject = (entity: EventEntity): Event => {
  const event: Event = mapEntityToDomainObjectWithoutGraphRelations(entity);
  if (entity.parents) {
    event.parents = entity.parents.map(mapEntityToDomainObjectWithoutGraphRelations);
  }
  if (entity.children) {
    event.children = entity.children.map(mapEntityToDomainObjectWithoutGraphRelations);
  }
  return event;
};

const mapEntityToDomainObjectWithoutGraphRelations = (entity: EventEntity): Event => ({
  id: entity.id,
  sessionId: entity.sessionId,
  status: entity.status,
  type: entity.type,
  charactersMetadataArray: mapTextFieldMetadata(entity.charactersMetadataArray),
  placeMetadataArray: mapTextFieldMetadata(entity.placeMetadataArray),
  descriptionMetadataArray: mapTextFieldMetadata(entity.descriptionMetadataArray),
  title: entity.title,
});

const mapTextFieldMetadata = (entities: TextFieldMetadataOption): TextFieldMetadata[] =>
  entities.map(entity => ({
    id: entity.id,
    value: entity.value,
    sequenceNumber: entity.sequenceNumber,
  }));

type TextFieldMetadataOption =
  | EventEntity['charactersMetadataArray']
  | EventEntity['placeMetadataArray']
  | EventEntity['descriptionMetadataArray'];
