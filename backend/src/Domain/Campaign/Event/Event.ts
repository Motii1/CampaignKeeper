export type Event = {
  id: number;
  descriptionMetadataArray: TextFieldMetadata[];
  charactersMetadataArray: TextFieldMetadata[];
  placeMetadataArray: TextFieldMetadata[];
  title: string;
  type: EventType;
  status: EventStatus;
  sessionId?: number;
  children?: Event[];
  parents?: Event[];
};

export type TextFieldMetadata = {
  id?: number;
  eventId?: number;
  value: string;
  sequenceNumber: number;
};

export enum EventType {
  Normal = 'normal',
  Fight = 'fight',
}

export enum EventStatus {
  Done = 'done',
  Omitted = 'omitted',
  None = 'none',
}
