import { ErrorWrapper } from '../../../../Common/Type/ErrorWrapper';
import { countInstancesById } from '../../../../Infrastracture/Entity/Schema/SchemaRepository';

export const deleteSchema = async (id: number): Promise<void> => {
  const instances = await countInstancesById(id);
  if (instances > 0) {
    throw new DeleteSchemaError('Cannot delete schema that has existing instances');
  }
};

export class DeleteSchemaError extends ErrorWrapper {}
