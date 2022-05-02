import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Schema } from '../../../Domain/Campaign/Schema/Schema';
import { deleteSchema, DeleteSchemaError } from '../../../Domain/Campaign/Schema/Service/Delete';
import { User } from '../../../Domain/User/User';
import { findUserCampaignById } from '../../../Infrastracture/Entity/Campaign/CampaignRepository';
import {
  findSchemaById,
  findSchemasByCampaignId,
  saveSchema,
} from '../../../Infrastracture/Entity/Schema/SchemaRepository';
import { authorization } from '../../Middleware/Auth/Authorization';
import { extractUserFromCookies } from '../../Util/Authorization';
import { IController } from '../IController';
import { getSchemaQuerySchema } from './Dto/GetSchemaListQuery';
import { SchemaInsertDto, schemaInsertDtoSchema } from './Dto/SchemaInsertDto';

enum SchemaRoutes {
  List = '/list',
}

export class SchemaContoller implements IController {
  private router: Router;

  constructor() {
    this.router = Router();
    this.declareRoutes();
  }

  private declareRoutes = (): void => {
    this.router.post('/', authorization, asyncHandler(this.insertSchemaHandler));
    this.router.delete('/:id', authorization, asyncHandler(this.deleteSchemaHandler));
    this.router.get(SchemaRoutes.List, authorization, asyncHandler(this.getSchemasHandler));
  };

  /**
   * @route GET /schema/list
   * @group schema - Operations related to schema data
   * @param {number} campaignId.query.required - id of campaign
   * @returns {GetSchemaListDto.model} 200 - Success
   * @returns {EmptyResponse.model} 400 - Wrong data format
   * @returns {EmptyResponse.model} 404 - Campaign not found
   * @security cookieAuth
   */
  private getSchemasHandler = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = getSchemaQuerySchema.validate(req.query);
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

    const schemas = await findSchemasByCampaignId(campaignId);
    res.status(200).json({ schemas });
  };

  /**
   * @route DELETE /schema/{id}
   * @group schema - Operations related to schema data
   * @returns {EmptyResponse.model} 200 - Schema successfully deleted
   * @returns {Message.model} 400 - Wrong schema id or deletion error
   * @returns {EmptyResponse.model} 404 - User schema not found
   * @security cookieAuth
   */
  private deleteSchemaHandler = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!this.isSchemaIdValid(id)) {
      res.status(400).json({ message: 'Given id does not match correct format' });
      return;
    }
    const user = await extractUserFromCookies(req.cookies);
    const schema = await findSchemaById(id);
    const permission = await this.permissionsToSchema(schema, user);
    if (!permission) {
      res.status(404).json({});
      return;
    }
    try {
      await deleteSchema(id);
      res.status(200).json({});
    } catch (error) {
      if (error instanceof DeleteSchemaError) {
        res.status(400).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  /**
   * @route POST /schema
   * @group schema - Operations related to schema data
   * @param {SchemaInsertDto.model} data.body.required - schema insert data
   * @returns {SingleGetSchemaListDto.model} 200 - Schema successfully saved
   * @returns {EmptyResponse.model} 400 - Data in wrong format
   * @returns {EmptyResponse.model} 404 - User campaign of given id not found
   * @security cookieAuth
   */
  private insertSchemaHandler = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = schemaInsertDtoSchema.validate(req.body);
    if (error) {
      res.status(400).json({});
      return;
    }
    const dto = value as SchemaInsertDto;
    const user = await extractUserFromCookies(req.cookies);
    const campaign = await findUserCampaignById(dto.campaignId, user);
    if (!campaign) {
      res.status(404).json({});
    }
    const schema = await saveSchema(dto);
    res.status(200).json(schema);
  };

  private permissionsToSchema = async (schema: Schema | null, user: User): Promise<boolean> => {
    if (!schema) {
      return false;
    }
    const campaign = await findUserCampaignById(schema.campaignId, user);
    return !!campaign;
  };

  private isSchemaIdValid = (id: number): boolean => !isNaN(id) && id > 0;

  getRouter = (): Router => this.router;
}
