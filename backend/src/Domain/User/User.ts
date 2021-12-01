export type User = {
  id?: number;
  username: string;
  passwordHash: string;
  email: string;
  image: Buffer | null;
};
