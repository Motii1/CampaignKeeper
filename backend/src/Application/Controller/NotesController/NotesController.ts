import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Note } from '../../../Domain/User/Note/Note';
import {
  deleteNoteById,
  findUserNoteById,
  findUserNotes,
  saveNote,
} from '../../../Infrastracture/Entity/Note/NoteRepository';
import { authorization } from '../../Middleware/Auth/Authorization';
import { extractUserFromCookies } from '../../Util/Authorization';
import { IController } from '../IController';
import { SingleGetNoteListDto } from './Dto/GetNoteListDto';
import { NoteInsertDto, noteInsertDtoSchema } from './Dto/NoteInsertDto';
import { NoteUpdateDto, noteUpdateDtoSchema } from './Dto/NoteUpdateDto';

export enum NoteRoutes {
  List = '/list',
}

export class NotesController implements IController {
  private router: Router;

  constructor() {
    this.router = Router();
    this.declareRoutes();
  }

  private declareRoutes = (): void => {
    this.router.get(NoteRoutes.List, authorization, asyncHandler(this.getNotesListHandler));
    this.router.patch('/:id', authorization, asyncHandler(this.updateNoteHandler));
    this.router.post('/', authorization, asyncHandler(this.insertNoteHandler));
    this.router.delete('/:id', authorization, asyncHandler(this.deleteNoteHandler));
    this.router.get('/:id', authorization, asyncHandler(this.getSingleNoteHandler));
  };

  /**
   * @route GET /note/:id
   * @group note - Operations related to notes data
   * @returns {SingleGetNoteListDto.model} 200 - Success
   * @returns {EmptyResponse.model} 400 - Wrong data format
   * @returns {EmptyResponse.model} 404 - Note not found
   * @security cookieAuth
   */
  private getSingleNoteHandler = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!this.isIdValid(id)) {
      res.status(400).json({});
      return;
    }
    const user = await extractUserFromCookies(req.cookies);
    const note = await findUserNoteById(id, user.id!);
    if (!note) {
      res.status(404).json({});
      return;
    }
    res.status(200).json(this.mapToReturnNoteDto(note));
  };

  /**
   * @route GET /note/list/
   * @group note - Operations related to notes data
   * @returns {GetNoteListDto.model} 200 - Success
   * @returns {EmptyResponse.model} 400 - Wrong data format
   * @returns {EmptyResponse.model} 404 - Schema or campaign not found
   * @security cookieAuth
   */
  private getNotesListHandler = async (req: Request, res: Response): Promise<void> => {
    const user = await extractUserFromCookies(req.cookies);
    const notes = await findUserNotes(user.id!);
    res.status(200).json({ notes: notes.map(item => this.mapToReturnNoteDto(item)) });
  };

  /**
   * @route DELETE /note/{id}
   * @group note - Operations related to notes data
   * @returns {EmptyResponse.model} 200 - Note successfully deleted
   * @returns {EmptyResponse.model} 400 - Bad Request
   * @returns {EmptyResponse.model} 404 - Note not found
   * @security cookieAuth
   */
  private deleteNoteHandler = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!this.isIdValid(id)) {
      res.status(400).json();
      return;
    }
    const user = await extractUserFromCookies(req.cookies);
    const note = await findUserNoteById(id, user.id!);
    if (!note) {
      res.status(404).json({});
      return;
    }
    await deleteNoteById(id);
    res.status(200).json({});
  };

  /**
   * @route PATCH /note/{id}
   * @group note - Operations related to notes data
   * @param {NoteUpdateDto.model} data.body.required - note update data
   * @returns {EmptyResponse.model} 200 - Note successfully saved
   * @returns {EmptyResponse.model} 400 - Data in wrong format
   * @returns {EmptyResponse.model} 404 - Note not found
   * @security cookieAuth
   */
  private updateNoteHandler = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const { error, value } = noteUpdateDtoSchema.validate(req.body);
    if (!this.isIdValid(id) || error) {
      res.status(400).json({});
      return;
    }
    const user = await extractUserFromCookies(req.cookies);
    const note = await findUserNoteById(id, user.id!);
    if (!note) {
      res.status(404).json({});
      return;
    }
    const dto = value as NoteUpdateDto;
    await saveNote({ ...note, value: dto.value });
    res.status(200).json({});
  };

  /**
   * @route POST /note
   * @group note - Operations related to notes data
   * @param {NoteInsertDto.model} data.body.required - note insert data
   * @returns {SingleGetNoteListDto.model} 200 - Note successfully saved
   * @returns {EmptyResponse.model} 400 - Data in wrong format
   * @security cookieAuth
   */
  private insertNoteHandler = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = noteInsertDtoSchema.validate(req.body);
    if (error) {
      res.status(400).json({});
      return;
    }
    const dto = value as NoteInsertDto;
    const user = await extractUserFromCookies(req.cookies);
    const saved = await saveNote({ user, value: dto.value });
    res.status(200).json(this.mapToReturnNoteDto(saved));
  };

  private isIdValid = (id: number) => !isNaN(id) && id > 0;

  private mapToReturnNoteDto = (note: Note): SingleGetNoteListDto => ({
    id: note.id,
    value: note.value,
  });

  getRouter = (): Router => this.router;
}
