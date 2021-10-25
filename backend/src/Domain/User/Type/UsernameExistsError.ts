import { ErrorWrapper } from '../../../Common/Type/ErrorWrapper';

export class UsernameExistsError extends ErrorWrapper {}

export const isUsernameExistsError = (subject: unknown): subject is UsernameExistsError =>
  subject instanceof UsernameExistsError;
