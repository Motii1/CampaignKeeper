import { User } from '../User/User';
import { Schema } from './Schema/Schema';
import { Session } from './Session/Session';

export type Campaign = {
  id: number;
  name: string;
  user: User;
  createdAt: Date;
  image: Buffer | null;
  schemas: Schema[];
  sessions: Session[];
};
