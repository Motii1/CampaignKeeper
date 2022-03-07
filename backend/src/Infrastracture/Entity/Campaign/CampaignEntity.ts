import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SchemaEntity } from '../Schema/SchemaEntity';
import { SessionEntity } from '../Session/SessionEntity';
import { UserEntity } from '../User/UserEntity';

@Entity({ name: 'campaign' })
export class CampaignEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 128 })
  name!: string;

  @ManyToOne(() => UserEntity, user => user.campaigns, { nullable: false, eager: true })
  user!: UserEntity;

  @OneToMany(() => SchemaEntity, schema => schema.campaign, { eager: true })
  schemas!: SchemaEntity[];

  @OneToMany(() => SessionEntity, session => session.campaign, { eager: true })
  sessions!: SessionEntity[];

  @Column({ type: 'varbinary', nullable: true, length: 'max' })
  image!: Buffer | null;

  @CreateDateColumn()
  createdAt!: Date;
}
