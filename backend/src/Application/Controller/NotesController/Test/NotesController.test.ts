import { dropDb, initDb } from '../../../../Common/Test/Database';
import { insertMockedUser } from '../../../../Common/Test/Token';
import { deleteNote, insertNote, readNoteById, readNotesList, updateNote } from './common';

describe('NotesController', () => {
  beforeEach(async () => {
    await initDb();
    await insertMockedUser();
  });
  afterEach(async () => await dropDb());

  it('should insert note', async () => {
    const response = await insertNote({ value: 'test' });

    expect(response.status).toEqual(200);
    expect(response.body).toStrictEqual({ id: expect.any(Number), value: 'test' });
  });

  it('should read note by id', async () => {
    const note = await insertNote({ value: 'test' });
    const response = await readNoteById(note.body.id);

    expect(response.status).toEqual(200);
    expect(response.body).toStrictEqual({ id: expect.any(Number), value: 'test' });
  });

  it('should read notes list', async () => {
    await insertNote({ value: 'test1' });
    await insertNote({ value: 'test2' });
    await insertNote({ value: 'test3' });
    const response = await readNotesList();

    expect(response.body.notes).toHaveLength(3);
    expect(response.body.notes).toEqual(
      expect.arrayContaining([
        { id: expect.any(Number), value: 'test1' },
        { id: expect.any(Number), value: 'test2' },
        { id: expect.any(Number), value: 'test3' },
      ])
    );
  });

  it('should delete note by id', async () => {
    const note = await insertNote({ value: 'test' });
    const listBefore = await readNotesList();
    expect(listBefore.body.notes).toHaveLength(1);

    const response = await deleteNote(note.body.id);
    expect(response.status).toBe(200);
    const list = await readNotesList();
    expect(list.body.notes).toHaveLength(0);
  });

  it('should update note', async () => {
    const note = await insertNote({ value: 'test' });
    const updated = await updateNote(note.body.id, { value: 'updated' });
    expect(updated.status).toBe(200);

    const response = await readNoteById(note.body.id);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: expect.any(Number), value: 'updated' });
  });
});
