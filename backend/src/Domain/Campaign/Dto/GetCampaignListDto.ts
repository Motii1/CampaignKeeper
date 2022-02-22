export type GetCampaignListDto = SingleGetCampaignListDto[];

export type SingleGetCampaignListDto = {
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
