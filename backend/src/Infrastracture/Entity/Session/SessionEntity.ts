import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column({ length: 32 })
  type!: string;

  @Column({ nullable: true, length: 64 })
  name!: string;

  @OneToMany(() => EventEntity, event => event.session)
  events!: EventEntity[];

  @ManyToOne(() => CampaignEntity, campaign => campaign.sessions, { nullable: false })
  campaign!: CampaignEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
