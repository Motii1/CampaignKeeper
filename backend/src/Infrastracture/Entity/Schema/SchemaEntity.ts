import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CampaignEntity } from '../Campaign/CampaignEntity';

@Entity({ name: 'schema' })
export class SchemaEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 128 })
  title!: string;

  @Column({ name: 'campaign_id' })
  campaignId?: number;

  @ManyToOne(() => CampaignEntity, campaign => campaign.schemas, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'campaign_id' })
  campaign!: CampaignEntity;

  @Column('simple-array')
  fields!: string[];
}
