import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Event, TextFieldMetadata } from '../../../Domain/Campaign/Event/Event';
import { createEvent, CreateEventError } from '../../../Domain/Campaign/Event/Service/Create';
import { updateEvent, UpdateEventError } from '../../../Domain/Campaign/Event/Service/Update';
import { Session } from '../../../Domain/Campaign/Session/Session';
import { User } from '../../../Domain/User/User';
import { findUserCampaignById } from '../../../Infrastracture/Entity/Campaign/CampaignRepository';
import {
  deleteEventById,
  findEventById,
  findEventsBySessionIdWithRelations,
} from '../../../Infrastracture/Entity/Event/EventRepository';
import { findSessionById } from '../../../Infrastracture/Entity/Session/SessionRepository';
import { authorization } from '../../Middleware/Auth/Authorization';
import { extractUserFromCookies } from '../../Util/Authorization';
import { IController } from '../IController';
import {
  EventInsertDto,
  eventInsertDtoSchema,
  TextFieldMetadata as TextFieldMetadataDto,
} from './Dto/EventInsertDto';
import { EventUpdateDto, eventUpdateDtoSchema } from './Dto/EventUpdateDto';
import { SingleGetEventListDto } from './Dto/GetEventListDto';

enum EventRoutes {
  Graph = '/graph',
}

export class EventController implements IController {
  private router: Router;

  constructor() {
    this.router = Router();
    this.declareRoutes();
  }

  private declareRoutes = (): void => {
    this.router.get(
      `${EventRoutes.Graph}/:sessionId`,
      authorization,
      asyncHandler(this.getGraphHandler)
    );
    this.router.patch('/:id', authorization, asyncHandler(this.updateEventHandler));
    this.router.post('/', authorization, asyncHandler(this.insertEventHandler));
    this.router.delete('/:id', authorization, asyncHandler(this.deleteEventHandler));
    this.router.get('/:id', authorization, asyncHandler(this.getSingleEventHandler));
  };

  /**
   * @route GET /event/:id
   * @group event - Operations related to event data
   * @returns {SingleGetEventListDto.model} 200 - Success
   * @returns {EmptyResponse.model} 400 - Wrong data format
   * @returns {EmptyResponse.model} 404 - Event not found
   * @security cookieAuth
   */
  private getSingleEventHandler = async (req: Request, res: Response): Promise<void> => {
    const eventId = Number(req.params.id);
    if (!this.isIdValid(eventId)) {
      res.status(400).json({});
      return;
    }

    const event = await findEventById(eventId);
    if (!event) {
      res.status(404).json({});
      return;
    }

    const user = await extractUserFromCookies(req.cookies);
    const session = await findSessionById(event.sessionId!);
    const permission = await this.permissionsToSession(session, user);
    if (!permission) {
      res.status(404).json({});
      return;
    }

    const dto: SingleGetEventListDto = this.parseSingleEventDto(event);
    res.status(200).json(dto);
  };

  /**
   * @route GET /graph/{sessionId}
   * @group event - Operations related to event data
   * @returns {GetEventListDto.model} 200 - Success
   * @returns {EmptyResponse.model} 400 - Wrong data format
   * @returns {EmptyResponse.model} 404 - Schema or campaign not found
   * @security cookieAuth
   */
  private getGraphHandler = async (req: Request, res: Response): Promise<void> => {
    const sessionId = Number(req.params.sessionId);
    if (!this.isIdValid(sessionId)) {
      res.status(400).json();
      return;
    }
    const user = await extractUserFromCookies(req.cookies);
    const session = await findSessionById(sessionId);
    const permission = await this.permissionsToSession(session, user);
    if (!permission) {
      res.status(404).json();
      return;
    }
    const events = await findEventsBySessionIdWithRelations(sessionId);
    const dtos = events.map(this.parseSingleEventDto);
    res.status(200).json({
      events: dtos,
    });
  };

  /**
   * @route DELETE /event/{id}
   * @group event - Operations related to event data
   * @returns {EmptyResponse.model} 200 - Event successfully deleted
   * @returns {EmptyResponse.model} 400 - Wrong event id
   * @returns {EmptyResponse.model} 404 - Event not found
   * @security cookieAuth
   */
  private deleteEventHandler = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!this.isIdValid(id)) {
      res.status(400).json({ message: 'Given id does not match correct format' });
      return;
    }
    const user = await extractUserFromCookies(req.cookies);
    const event = await findEventById(id);
    if (!event) {
      res.status(404).json({});
      return;
    }
    const session = await findSessionById(event.sessionId!);
    const permission = await this.permissionsToSession(session, user);
    if (!permission) {
      res.status(404).json({});
      return;
    }
    await deleteEventById(id);
    res.status(200).json({});
  };

  /**
   * @route PATCH /event/{id}
   * @group event - Operations related to event data
   * @param {EventUpdateDto.model} data.body.required - event update data
   * @returns {EmptyResponse.model} 200 - Event successfully saved
   * @returns {Message.model} 400 - Data in wrong format
   * @returns {EmptyResponse.model} 404 - Event not found
   * @security cookieAuth
   */
  private updateEventHandler = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const { error, value } = eventUpdateDtoSchema.validate(req.body);
    if (!this.isIdValid(id) || error) {
      res.status(400).json({ message: 'Given data does not match correct format' });
      return;
    }
    const user = await extractUserFromCookies(req.cookies);
    const event = await findEventById(id);
    if (!event) {
      res.status(404).json({});
      return;
    }
    const session = await findSessionById(event.sessionId!);
    const permission = await this.permissionsToSession(session, user);
    if (!permission) {
      res.status(404).json({});
      return;
    }

    const dto = value as EventUpdateDto;
    try {
      await updateEvent(dto);
      res.status(200).json({});
    } catch (error) {
      if (error instanceof UpdateEventError) {
        res.status(400).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  /**
   * @route POST /event
   * @group event - Operations related to event data
   * @param {EventInsertDto.model} data.body.required - event insert data
   * @returns {SingleGetEventListDto.model} 200 - Event successfully saved
   * @returns {Message.model} 400 - Data in wrong format
   * @returns {EmptyResponse.model} 404 - Event of given id not found
   * @security cookieAuth
   */
  private insertEventHandler = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = eventInsertDtoSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: 'Provided data does not meet required format' });
      return;
    }
    const dto = value as EventInsertDto;
    const user = await extractUserFromCookies(req.cookies);
    const session = await findSessionById(dto.sessionId);
    const permission = await this.permissionsToSession(session, user);
    if (!permission) {
      res.status(404).json({});
      return;
    }
    try {
      const savedEvent = await createEvent(dto);
      res.status(200).json(this.parseSingleEventDto(savedEvent));
    } catch (error) {
      if (error instanceof CreateEventError) {
        res.status(400).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  private isIdValid = (id: number) => !isNaN(id) && id > 0;

  private permissionsToSession = async (session: Session | null, user: User): Promise<boolean> => {
    if (!session) {
      return false;
    }

    const campaign = await findUserCampaignById(session.campaignId, user);
    return !!campaign;
  };

  private parseSingleEventDto = (event: Event): SingleGetEventListDto => ({
    id: event.id!,
    sessionId: event.sessionId!,
    title: event.title,
    placeMetadataArray: event.placeMetadataArray.map(this.parseTextFieldMetadata),
    descriptionMetadataArray: event.descriptionMetadataArray.map(this.parseTextFieldMetadata),
    charactersMetadataArray: event.charactersMetadataArray.map(this.parseTextFieldMetadata),
    status: event.status,
    type: event.type,
    childrenIds: event.children!.map(({ id }) => id),
    parentIds: event.parents!.map(({ id }) => id),
  });

  private parseTextFieldMetadata = (item: TextFieldMetadata): TextFieldMetadataDto => ({
    value: item.value,
    sequenceNumber: item.sequenceNumber,
  });

  getRouter = (): Router => this.router;
}
