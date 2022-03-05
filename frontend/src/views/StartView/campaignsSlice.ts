import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import protectedApiClient from '../../axios/axios';

interface CampaignsState {
  campaignsList: Campaign[];
  isCampaignListDownloaded: boolean;
}

type Campaign = {
  id: number;
  name: string;
  schemas: {
    id: number;
  }[];
  sessions: {
    id: number;
  }[];
  createdAt: Date;
  imageBase64?: string;
};

const initialState: CampaignsState = {
  campaignsList: [],
  isCampaignListDownloaded: false,
};

export const fetchCampaigns = createAsyncThunk('campaigns/fetchCampaigns', async () => {
  const response = await protectedApiClient.get('api/campaign/list');
  return response;
});

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchCampaigns.fulfilled, (state, action) => {
      if (action.payload.status === 200) {
        state.isCampaignListDownloaded = true;
        state.campaignsList = action.payload.data.campaigns;
        // eslint-disable-next-line no-console
        console.log(action.payload.data);
      }
    });
  },
});

// export const {} = campaignsSlice.actions;

export default campaignsSlice.reducer;
