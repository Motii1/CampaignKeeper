export type GetCampaignListDto = SingleGetCampaignListDto[];

export type SingleGetCampaignListDto = {
  id: number;
  name: string;
  createdAt: Date;
  imageBase64?: string;
};
