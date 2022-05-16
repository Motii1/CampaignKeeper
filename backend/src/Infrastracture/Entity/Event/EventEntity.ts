import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventStatus, EventType } from '../../../Domain/Campaign/Event/Event';
import { SessionEntity } from '../Session/SessionEntity';
import { CharactersMetadataEntity } from './CharactersMetadataEntity';
import { DescriptionMetadataEntity } from './DescriptionMetadataEntity';
import { PlaceMetadataEntity } from './PlaceMetadataEntity';

@Entity({ name: 'event' })
export class EventEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 128 })
  title!: string;

  @Column({ enum: EventType })
  type!: EventType;

  @Column({ enum: EventStatus })
  status!: EventStatus;

  @OneToMany(() => PlaceMetadataEntity, metadata => metadata.event, {
    eager: true,
    onDelete: 'CASCADE',
    cascade: true,
  })
  placeMetadataArray!: PlaceMetadataEntity[];

  @OneToMany(() => DescriptionMetadataEntity, metadata => metadata.event, {
    eager: true,
    onDelete: 'CASCADE',
    cascade: true,
  })
  descriptionMetadataArray!: DescriptionMetadataEntity[];

  @OneToMany(() => CharactersMetadataEntity, metadata => metadata.event, {
    eager: true,
    onDelete: 'CASCADE',
    cascade: true,
  })
  charactersMetadataArray!: CharactersMetadataEntity[];

  @ManyToMany(() => EventEntity, event => event.parents)
  @JoinTable()
  children!: EventEntity[];

  @ManyToMany(() => EventEntity, event => event.children)
  parents!: EventEntity[];

  @ManyToOne(() => SessionEntity, session => session.events, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'session_id', referencedColumnName: 'id' })
  session!: SessionEntity;

  @Column({ name: 'session_id' })
  sessionId?: number;
}
