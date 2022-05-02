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

  @ManyToOne(() => UserEntity, user => user.campaigns, {
    nullable: false,
    eager: true,
    onDelete: 'CASCADE',
  })
  user!: UserEntity;

  @OneToMany(() => SchemaEntity, schema => schema.campaign, { onDelete: 'CASCADE' })
  schemas!: SchemaEntity[];

  @OneToMany(() => SessionEntity, session => session.campaign, { onDelete: 'CASCADE' })
  sessions!: SessionEntity[];

  @Column({ type: 'varbinary', nullable: true, length: 'max' })
  image!: Buffer | null;

  @CreateDateColumn()
  createdAt!: Date;
}
