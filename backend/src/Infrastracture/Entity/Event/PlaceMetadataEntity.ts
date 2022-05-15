import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EventEntity } from './EventEntity';

@Entity({ name: 'place_metadata' })
export class PlaceMetadataEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'event_id' })
  eventId?: number;

  @ManyToOne(() => EventEntity, event => event.placeMetadataArray, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  event!: EventEntity;

  @Column({ length: 'max' })
  value!: string;

  @Column()
  sequenceNumber!: number;
}
