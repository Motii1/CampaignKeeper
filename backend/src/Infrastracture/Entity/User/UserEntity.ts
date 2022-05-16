import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DbAwareColumn } from '../../../Common/Decorator/DbAwareColumn';
import { CampaignEntity } from '../Campaign/CampaignEntity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 64 })
  @Index({ unique: true })
  username!: string;

  @Column()
  passwordHash!: string;

  @Column()
  @Index({ unique: true })
  email!: string;

  @DbAwareColumn({ type: 'varbinary', nullable: true, length: 'max' })
  image!: Buffer | null;

  @OneToMany(() => CampaignEntity, campaign => campaign.user, { onDelete: 'CASCADE' })
  campaigns!: CampaignEntity[];
}
