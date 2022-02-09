import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CampaignEntity } from '../Campaign/CampaignEntity';

@Entity({ name: 'schema' })
export class SchemaEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 64 })
  title!: string;

  @Column()
  deletable!: boolean;

  @Column({ length: 32 })
  type!: string;

  @ManyToOne(() => CampaignEntity, campaign => campaign.schemas, { nullable: false })
  campaign!: CampaignEntity;

  @Column({ type: 'varbinary', nullable: true, length: 'max' })
  image!: Buffer | null;

  @Column({ type: 'text' })
  schema!: string;
}
