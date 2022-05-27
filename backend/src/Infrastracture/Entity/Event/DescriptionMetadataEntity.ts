import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DbAwareColumn } from '../../../Common/Decorator/DbAwareColumn';
import { TextFieldType } from '../../../Domain/Campaign/Event/Event';
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

  @DbAwareColumn({ length: 'max' })
  value!: string;

  @Column({ enum: TextFieldType })
  type!: TextFieldType;

  @Column()
  sequenceNumber!: number;
}
