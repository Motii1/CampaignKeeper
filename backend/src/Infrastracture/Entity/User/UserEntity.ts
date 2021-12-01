import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Index({ unique: true })
  username!: string;

  @Column()
  passwordHash!: string;

  @Column()
  @Index({ unique: true })
  email!: string;

  @Column({ type: 'varbinary', nullable: true, length: 'max' })
  image!: Buffer | null;
}
