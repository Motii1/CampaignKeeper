import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FieldValueType } from '../../../Domain/Campaign/SchemaInstance/FieldValueType';
import { SchemaInstanceEntity } from './SchemaInstanceEntity';

@Entity({ name: 'schema_instance_metadata' })
export class SchemaInstanceMetadataEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'object_id' })
  objectId?: number;

  @ManyToOne(() => SchemaInstanceEntity, object => object.metadataArray, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'object_id', referencedColumnName: 'id' })
  object!: SchemaInstanceEntity;

  @Column({ enum: FieldValueType })
  type!: FieldValueType;

  @Column({ type: 'text' })
  value!: string;

  @Column()
  sequenceNumber!: number;

  @Column({ type: 'text' })
  fieldName!: string;
}
