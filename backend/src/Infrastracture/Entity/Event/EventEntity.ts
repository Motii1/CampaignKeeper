import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SessionEntity } from '../Session/SessionEntity';

@Entity({ name: 'event' })
export class EventEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 64 })
  title!: string;

  @Column({ length: 32 })
  type!: string;

  @Column({ length: 32 })
  state!: string;

  @Column()
  location!: string;

  @Column()
  marked!: boolean;

  @Column()
  description!: string;

  @Column()
  characters!: string;

  @ManyToMany(() => EventEntity, event => event.parents)
  @JoinTable()
  children!: EventEntity[];

  @ManyToMany(() => EventEntity, event => event.children)
  parents!: EventEntity[];

  @Column()
  positionX!: number;

  @Column()
  positionY!: number;

  @ManyToOne(() => SessionEntity, session => session.events, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  session!: SessionEntity;
}
