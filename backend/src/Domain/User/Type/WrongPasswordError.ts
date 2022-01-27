import { ErrorWrapper } from '../../../Common/Type/ErrorWrapper';

export class WrongPasswordError extends ErrorWrapper {}

export const isWrongPasswordError = (subject: unknown): subject is WrongPasswordError =>
  subject instanceof WrongPasswordError;
