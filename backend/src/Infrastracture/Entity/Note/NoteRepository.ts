import { getRepository } from 'typeorm';
import { Note } from '../../../Domain/User/Note/Note';
import { mapEntityToDomainObject } from './Mapping';
import { NoteEntity } from './NoteEntity';

export const findNoteById = async (id: number): Promise<Note | null> => {
  const entity = await getRepository(NoteEntity).findOne({ where: { id } });
  return entity ? mapEntityToDomainObject(entity) : null;
};

export const findUserNoteById = async (id: number, userId: number): Promise<Note | null> => {
  const entity = await getRepository(NoteEntity).findOne({ where: { id, user: { id: userId } } });
  return entity ? mapEntityToDomainObject(entity) : null;
};

export const deleteNoteById = async (id: number): Promise<void> => {
  await getRepository(NoteEntity).delete({ id });
};

export const saveNote = async (note: Omit<Note, 'id'> & { id?: number }): Promise<Note> => {
  const entity = await getRepository(NoteEntity).save(note);
  return mapEntityToDomainObject(entity);
};

export const findUserNotes = async (userId: number): Promise<Note[]> => {
  const entities = await getRepository(NoteEntity).find({ user: { id: userId } });
  return entities.map(mapEntityToDomainObject);
};
