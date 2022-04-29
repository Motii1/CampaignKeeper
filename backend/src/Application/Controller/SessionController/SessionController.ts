import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Session } from '../../../Domain/Campaign/Session/Session';
import { User } from '../../../Domain/User/User';
import { findUserCampaignById } from '../../../Infrastracture/Entity/Campaign/CampaignRepository';
import {
  deleteSessionById,
  findSessionById,
  findSessionsByCampaignId,
  saveSession,
} from '../../../Infrastracture/Entity/Session/SessionRepository';
import { authorization } from '../../Middleware/Auth/Authorization';
import { extractUserFromCookies } from '../../Util/Authorization';
import { IController } from '../IController';
import { getSessionQuerySchema } from './Dto/GetSessionListQuery';
import { SessionInsertDto, sessionInsertDtoSchema } from './Dto/SessionInsertDto';
import { SessionUpdateDto, sessionUpdateDtoSchema } from './Dto/SessionUpdateDto';

enum SessionRoutes {
  List = '/list',
}

export class SessionContoller implements IController {
  private router: Router;

  constructor() {
    this.router = Router();
    this.declareRoutes();
  }

  private declareRoutes = (): void => {
    this.router.patch('/:id', authorization, asyncHandler(this.updateSessionHandler));
    this.router.post('/', authorization, asyncHandler(this.insertSessionHandler));
    this.router.delete('/:id', authorization, asyncHandler(this.deleteSessionHandler));
    this.router.get(SessionRoutes.List, authorization, asyncHandler(this.getSessionsHandler));
  };

  /**
   * @route GET /session/list
   * @group session - Operations related to session data
   * @param {number} campaignId.query.required - id of campaign
   * @returns {GetSessionListDto.model} 200 - Success
   * @returns {EmptyResponse.model} 400 - Wrong data format
   * @returns {EmptyResponse.model} 404 - Campaign not found
   * @security cookieAuth
   */
  private getSessionsHandler = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = getSessionQuerySchema.validate(req.query);
    if (error) {
      res.status(400).json({});
      return;
    }
    const { campaignId } = value;
    const user = await extractUserFromCookies(req.cookies);
    const campaign = await findUserCampaignById(campaignId, user);
    if (!campaign) {
      res.status(404).json({});
      return;
    }
    const sessions = await findSessionsByCampaignId(campaignId);
    res.status(200).json({ sessions });
  };

  /**
   * @route DELETE /session/{id}
   * @group session - Operations related to session data
   * @returns {EmptyResponse.model} 200 - Session successfully deleted
   * @returns {EmptyResponse.model} 400 - Wrong session id
   * @returns {EmptyResponse.model} 404 - User session not found
   * @security cookieAuth
   */
  private deleteSessionHandler = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!this.isSessionIdValid(id)) {
      res.status(400).json({});
      return;
    }
    const user = await extractUserFromCookies(req.cookies);
    const session = await findSessionById(id);
    const permission = await this.permissionsToSession(session, user);
    if (!permission) {
      res.status(404).json({});
      return;
    }
    await deleteSessionById(id);
    res.status(200).json({});
  };

  /**
   * @route PATCH /session/{id}
   * @group session - Operations related to session data
   * @param {SessionUpdateDto.model} data.body.required - session update data
   * @returns {EmptyResponse.model} 200 - Session successfully saved
   * @returns {EmptyResponse.model} 400 - Data in wrong format
   * @returns {EmptyResponse.model} 404 - Session not found
   * @security cookieAuth
   */
  private updateSessionHandler = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const { error, value } = sessionUpdateDtoSchema.validate(req.body);
    if (!this.isSessionIdValid(id) || error) {
      res.status(400).json({});
      return;
    }
    const dto = value as SessionUpdateDto;
    const user = await extractUserFromCookies(req.cookies);
    const session = await findSessionById(id);
    const permission = await this.permissionsToSession(session, user);
    if (!permission) {
      res.status(404).json({});
      return;
    }
    await saveSession({
      ...session!,
      ...dto,
    });
    res.status(200).json({});
  };

  /**
   * @route POST /session
   * @group session - Operations related to session data
   * @param {SessionInsertDto.model} data.body.required - session insert data
   * @returns {SingleGetSessionListDto.model} 200 - Session successfully saved
   * @returns {EmptyResponse.model} 400 - Data in wrong format
   * @returns {EmptyResponse.model} 404 - User campaign of given id not found
   * @security cookieAuth
   */
  private insertSessionHandler = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = sessionInsertDtoSchema.validate(req.body);
    if (error) {
      res.status(400).json({});
      return;
    }
    const dto = value as SessionInsertDto;
    const user = await extractUserFromCookies(req.cookies);
    const campaign = await findUserCampaignById(dto.campaignId, user);
    if (!campaign) {
      res.status(404).json({});
      return;
    }
    const session = await saveSession(dto);
    res.status(200).json(session);
  };

  private permissionsToSession = async (session: Session | null, user: User): Promise<boolean> => {
    if (!session) {
      return false;
    }
    const campaign = await findUserCampaignById(session.campaignId, user);
    return !!campaign;
  };

  private isSessionIdValid = (id: number) => !isNaN(id) && id > 0;

  getRouter = (): Router => this.router;
}
