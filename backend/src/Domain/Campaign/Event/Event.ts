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
  displayStatus: EventDisplayStatus;
};

export type TextFieldMetadata = {
  id?: number;
  eventId?: number;
  value: string;
  sequenceNumber: number;
  type: TextFieldType;
};

export enum TextFieldType {
  id = 'id',
  string = 'string',
}

export enum EventType {
  Normal = 'normal',
  Fight = 'fight',
}

export enum EventStatus {
  Done = 'done',
  Omitted = 'omitted',
  None = 'none',
}

export enum EventDisplayStatus {
  Shown = 'shown',
  Hidden = 'hidden',
  Collapsed = 'collapsed',
}
