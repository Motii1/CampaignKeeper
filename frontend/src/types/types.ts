export enum CustomButtonBehavior {
  Submit,
  Upload,
  Func,
}

export enum CustomButtonType {
  Accent,
  Primary,
  Delete,
}

export enum FabIcon {
  Add,
  Save,
  Delete,
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

export type EditFieldMetadata = {
  value: string;
  id: null | string;
};

export type EditFieldsState = {
  [fieldName: string]: EditFieldMetadata[];
};
