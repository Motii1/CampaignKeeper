import { createSlice } from '@reduxjs/toolkit';
import { NavBarViewDialog } from '../../types/types';

interface StartViewState {
  name: string;
  image: null | File;
  type: NavBarViewDialog;
  campaignsNames: Array<string>;
}

const initialState: StartViewState = {
  name: '',
  image: null,
  type: NavBarViewDialog.NewCampaign,
  // ofc names for campaigns should be kept in another slice
  campaignsNames: [
    'Rime of the Frostmaiden',
    'Descent into Avernus',
    'Curse of Strahd',
    'Tomb of Anihilation',
    'Dragon of Icespire Peak',
    'Rise of Tiamat',
    `Storm Lord's Wrath`,
    `Sleeping Dragon's Wake`,
    'Divine Contention',
    'Hoard of the Dragon Queen',
  ],
};

const startViewSlice = createSlice({
  name: 'startView',
  initialState,
  reducers: {
    updateState: (state, action) => {
      state.name = action.payload.name ? action.payload.name : state.name;
      state.image =
        action.payload.image || action.payload.image === null ? action.payload.image : state.image;
      state.type = action.payload.type ? action.payload.type : state.type;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetState: (state, _action) => {
      state.name = '';
      state.image = null;
      state.type = NavBarViewDialog.NewCampaign;
    },
    // TO-DO: delete after API integration
    addCampaign: (state, action) => {
      state.campaignsNames.push(action.payload.campaignName);
    },
    // TO-DO: delete after API integration
    removeCampaign: (state, action) => {
      state.campaignsNames = state.campaignsNames.filter(
        name => name !== action.payload.campaignName
      );
    },
  },
});

export const { updateState, resetState, addCampaign, removeCampaign } = startViewSlice.actions;

export default startViewSlice.reducer;
