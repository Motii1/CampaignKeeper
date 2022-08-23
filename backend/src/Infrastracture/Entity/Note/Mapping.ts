import { Note } from '../../../Domain/User/Note/Note';
import { NoteEntity } from './NoteEntity';

export const mapEntityToDomainObject = (entity: NoteEntity): Note => ({
  id: entity.id,
  value: entity.value,
  user: entity.user,
});
