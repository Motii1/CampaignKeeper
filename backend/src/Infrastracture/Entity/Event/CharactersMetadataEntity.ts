import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TextFieldType } from '../../../Domain/Campaign/Event/Event';
import { EventEntity } from './EventEntity';

@Entity({ name: 'characters_metadata' })
export class CharactersMetadataEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'event_id' })
  eventId?: number;

  @ManyToOne(() => EventEntity, event => event.charactersMetadataArray, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event!: EventEntity;

  @Column({ length: 'max' })
  value!: string;

  @Column({ enum: TextFieldType })
  type!: TextFieldType;

  @Column()
  sequenceNumber!: number;
}
