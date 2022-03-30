import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CampaignEntity } from '../Campaign/CampaignEntity';
import { EventEntity } from '../Event/EventEntity';

@Entity({ name: 'session' })
export class SessionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true, length: 64 })
  name!: string;

  @OneToMany(() => EventEntity, event => event.session)
  events!: EventEntity[];

  @Column({ name: 'campaign_id' })
  campaignId?: number;

  @ManyToOne(() => CampaignEntity, campaign => campaign.sessions, { nullable: false })
  @JoinColumn({ name: 'campaign_id' })
  campaign!: CampaignEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
