import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DbAwareColumn } from '../../../Common/Decorator/DbAwareColumn';
import { UserEntity } from '../User/UserEntity';

@Entity({ name: 'note' })
export class NoteEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @DbAwareColumn({ length: 'max' })
  value!: string;

  @ManyToOne(() => UserEntity, user => user.notes, {
    nullable: false,
    eager: true,
    onDelete: 'CASCADE',
  })
  user!: UserEntity;
}
