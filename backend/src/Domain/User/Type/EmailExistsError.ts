import { ErrorWrapper } from '../../../Common/Type/ErrorWrapper';

export class EmailExistsError extends ErrorWrapper {}

export const isEmailExistsError = (subject: unknown): subject is EmailExistsError =>
  subject instanceof EmailExistsError;
