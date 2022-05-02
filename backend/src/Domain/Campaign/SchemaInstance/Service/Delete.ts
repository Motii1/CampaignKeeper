import { ErrorWrapper } from '../../../../Common/Type/ErrorWrapper';
import {
  countReferencesById,
  deleteSchemaInstanceById,
} from '../../../../Infrastracture/Entity/SchemaInstance/SchemaInstanceRepository';

export const deleteObject = async (id: number): Promise<void> => {
  const references = await countReferencesById(id);
  if (references > 0) {
    throw new DeleteObjectError('Cannot delete object that is referenced by other objects');
  }
  await deleteSchemaInstanceById(id);
};

export class DeleteObjectError extends ErrorWrapper {}
