import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EventEntity } from './EventEntity';

@Entity({ name: 'description_metadata' })
export class DescriptionMetadataEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'event_id' })
  eventId?: number;

  @ManyToOne(() => EventEntity, event => event.descriptionMetadataArray, {
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
