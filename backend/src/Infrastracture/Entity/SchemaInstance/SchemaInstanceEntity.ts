import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SchemaEntity } from '../Schema/SchemaEntity';

@Entity({ name: 'schema_instance' })
export class SchemaInstanceEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => SchemaEntity, { nullable: false })
  schema!: SchemaEntity;

  @Column({ type: 'text' })
  schemaValuesJson!: string;

  @Column({ type: 'varbinary', nullable: true, length: 'max' })
  image!: Buffer | null;
}
