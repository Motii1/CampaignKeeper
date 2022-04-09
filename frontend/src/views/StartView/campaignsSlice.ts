import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import protectedApiClient from '../../axios/axios';

type Campaign = {
  id: number;
  name: string;
  createdAt: Date;
  imageBase64: string;
};

type CampaignsState = {
  campaignsList: Campaign[];
  isCampaignsListDownloaded: boolean;
};

const initialState: CampaignsState = {
  campaignsList: [],
  isCampaignsListDownloaded: false,
};

export const fetchCampaigns = createAsyncThunk('campaigns/fetchCampaigns', async () => {
  const response = await protectedApiClient.get('api/campaign/list');
  return response;
});

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    addCampaign: (state, action) => {
      state.campaignsList = state.campaignsList.concat(action.payload.newCampaign);
    },
    editCampaign: (state, action) => {
      state.campaignsList = state.campaignsList.map(campaign => {
        if (campaign.id === action.payload.id) {
          campaign.name = action.payload.name;
          if (action.payload.imageBase64) campaign.imageBase64 = action.payload.imageBase64;
          return campaign;
        }
        return campaign;
      });
    },
    deleteCampaign: (state, action) => {
      state.campaignsList = state.campaignsList.filter(
        campaign => campaign.id !== action.payload.id
      );
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchCampaigns.fulfilled, (state, action) => {
      if (action.payload.status === 200) {
        state.isCampaignsListDownloaded = true;
        state.campaignsList = action.payload.data.campaigns;
      }
    });
  },
});

export const { addCampaign, editCampaign, deleteCampaign } = campaignsSlice.actions;

export default campaignsSlice.reducer;
