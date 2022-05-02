import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SchemaEntity } from '../Schema/SchemaEntity';
import { SchemaInstanceMetadataEntity } from './SchemaInstanceMetadataEntity';

@Entity({ name: 'schema_instance' })
export class SchemaInstanceEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'schema_id' })
  schemaId?: number;

  @ManyToOne(() => SchemaEntity, { nullable: false })
  @JoinColumn({ name: 'schema_id' })
  schema!: SchemaEntity;

  @Column({ length: 128 })
  title!: string;

  @OneToMany(() => SchemaInstanceMetadataEntity, metadata => metadata.object, {
    eager: true,
    onDelete: 'CASCADE',
  })
  metadataArray!: SchemaInstanceMetadataEntity[];

  @Column({ type: 'varbinary', nullable: true, length: 'max' })
  image!: Buffer | null;
}
