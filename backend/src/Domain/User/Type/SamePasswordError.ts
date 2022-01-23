import { ErrorWrapper } from '../../../Common/Type/ErrorWrapper';

export class SamePasswordError extends ErrorWrapper {}

export const isSamePasswordError = (subject: unknown): subject is SamePasswordError =>
  subject instanceof SamePasswordError;
