import { Express } from 'express';

export interface IApp {
  start(): void;
  getRouter(): Express;
}
