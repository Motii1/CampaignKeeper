import { User } from '../User/User';

export type Campaign = {
  id: number;
  name: string;
  user: User;
  createdAt: Date;
  image: Buffer | null;
};
