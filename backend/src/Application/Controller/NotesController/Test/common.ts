import { makeAuthorizedTestRequest } from '../../../../Common/Test/Request';
import { App } from '../../../App/App';
import { NoteInsertDto } from '../Dto/NoteInsertDto';
import { NoteUpdateDto } from '../Dto/NoteUpdateDto';
import { NoteRoutes, NotesController } from '../NotesController';

export const BASE_ENDPOINT = '/api/note';
export const testApp = new App([['/note', new NotesController()]]);

export const readNoteById = async (id: number) =>
  await makeAuthorizedTestRequest(testApp, `${BASE_ENDPOINT}/${id}`, 'get');

export const readNotesList = async () =>
  await makeAuthorizedTestRequest(testApp, `${BASE_ENDPOINT}/${NoteRoutes.List}`, 'get');

export const insertNote = async (note: NoteInsertDto) =>
  await makeAuthorizedTestRequest(testApp, BASE_ENDPOINT, 'post').send(note);

export const deleteNote = async (id: number) =>
  await makeAuthorizedTestRequest(testApp, `${BASE_ENDPOINT}/${id}`, 'delete');

export const updateNote = async (id: number, note: NoteUpdateDto) =>
  await makeAuthorizedTestRequest(testApp, `${BASE_ENDPOINT}/${id}`, 'patch').send(note);
