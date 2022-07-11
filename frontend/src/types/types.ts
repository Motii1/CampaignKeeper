export enum CustomButtonBehavior {
  Submit,
  Upload,
  Func,
}

export enum CustomButtonType {
  Accent,
  Primary,
  Delete,
  Inverted,
}

export enum FabIcon {
  Add,
  Save,
  Delete,
  Edit,
}

export enum NavBarViewDialog {
  NewCampaign,
  EditCampaign,
  NewSession,
  EditSession,
  NewSchema,
  NewEntry,
  EditEntry,
  NewEvent,
  EditEvent,
}

export enum CustomSnackbarType {
  Info,
  Success,
  Error,
}

export enum EventTileType {
  Map,
  Explorer,
  ExplorerParent,
}

export type ReferenceFieldMetadata = {
  value: string;
  id: null | string;
};

export type ReferenceFieldsState = {
  [fieldName: string]: ReferenceFieldMetadata[];
};
