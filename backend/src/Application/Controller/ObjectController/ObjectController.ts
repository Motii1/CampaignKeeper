import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Schema } from '../../../Domain/Campaign/Schema/Schema';
import { SingleGetObjectListDto } from '../../../Domain/Campaign/SchemaInstance/Dto/GetObjectListDto';
import { SchemaInstance } from '../../../Domain/Campaign/SchemaInstance/SchemaInstance';
import { createObject } from '../../../Domain/Campaign/SchemaInstance/Service/Create';
import {
  deleteObject,
  DeleteObjectError,
} from '../../../Domain/Campaign/SchemaInstance/Service/Delete';
import {
  updateObject,
  UpdateObjectError,
} from '../../../Domain/Campaign/SchemaInstance/Service/Update';
import { SchemaValidationError } from '../../../Domain/Campaign/SchemaInstance/Service/Validate';
import { User } from '../../../Domain/User/User';
import { findUserCampaignById } from '../../../Infrastracture/Entity/Campaign/CampaignRepository';
import { findSchemaById } from '../../../Infrastracture/Entity/Schema/SchemaRepository';
import {
  findSchemaInstanceById,
  findSchemaInstances,
} from '../../../Infrastracture/Entity/SchemaInstance/SchemaInstanceRepository';
import { authorization } from '../../Middleware/Auth/Authorization';
import { extractUserFromCookies } from '../../Util/Authorization';
import { IController } from '../IController';
import { getObjectQuerySchema } from './Dto/GetObjectListDto';
import { ObjectInsertDto, objectInsertDtoSchema } from './Dto/ObjectInsertDto';
import { ObjectUpdateDto, objectUpdateDtoSchema } from './Dto/ObjectUpdateDto';

enum ObjectRoutes {
  List = '/list',
}

export class ObjectController implements IController {
  private router: Router;

  constructor() {
    this.router = Router();
    this.declareRoutes();
  }

  private declareRoutes = (): void => {
    this.router.get(ObjectRoutes.List, authorization, asyncHandler(this.getObjectsHandler));
    this.router.patch('/:id', authorization, asyncHandler(this.updateObjectHandler));
    this.router.post('/', authorization, asyncHandler(this.insertObjectHandler));
    this.router.delete('/:id', authorization, asyncHandler(this.deleteObjectHandler));
    this.router.get('/:id', authorization, asyncHandler(this.getSingleObjectHandler));
  };

  /**
   * @route GET /object/:id
   * @group object - Operations related to object data
   * @returns {SingleGetObjectListDto.model} 200 - Success
   * @returns {EmptyResponse.model} 400 - Wrong data format
   * @returns {EmptyResponse.model} 404 - Object not found
   * @security cookieAuth
   */
  private getSingleObjectHandler = async (req: Request, res: Response): Promise<void> => {
    const objectId = Number(req.params.id);
    if (!this.isObjectIdValid(objectId)) {
      res.status(400).json({});
      return;
    }

    const object = await findSchemaInstanceById(objectId);
    if (!object) {
      res.status(404).json({});
      return;
    }

    const user = await extractUserFromCookies(req.cookies);
    const schema = await findSchemaById(object.schemaId!);
    const permission = await this.permissionsToSchema(schema, user);
    if (!permission) {
      res.status(404).json({});
      return;
    }

    const dto: SingleGetObjectListDto = this.parseSingleObjectDto(object);
    res.status(200).json(dto);
  };

  /**
   * @route GET /object/list
   * @group object - Operations related to object data
   * @param {number} schemaId.query - id of schema
   * @param {number} campaignId.query - id of campaign
   * @returns {GetObjectListDto.model} 200 - Success
   * @returns {Message.model} 400 - Wrong data format
   * @returns {Message.model} 404 - Schema or campaign not found
   * @security cookieAuth
   */
  private getObjectsHandler = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = getObjectQuerySchema.validate(req.query);
    if (error) {
      res.status(400).json({ message: 'Given data does not match correct format ' });
      return;
    }
    const { schemaId, campaignId } = value;
    if (!schemaId && !campaignId) {
      res.status(400).json({
        message: 'You have to provide at least one query parameter',
      });
      return;
    }
    const schema = await findSchemaById(schemaId);
    const user = await extractUserFromCookies(req.cookies);
    const permission = await this.permissionsToSchema(schema, user);
    if (!permission && schemaId) {
      res.status(404).json({ message: 'Schema with given id was not found' });
      return;
    }
    const campaign = await findUserCampaignById(campaignId, user);
    if (!campaign && campaignId) {
      res.status(404).json({ message: 'Campaign with given id was not found' });
      return;
    }
    const objects = await findSchemaInstances(schemaId, campaignId);
    const dtos = objects.map(this.parseSingleObjectDto);
    res.status(200).json({
      objects: dtos,
    });
  };

  /**
   * @route DELETE /object/{id}
   * @group object - Operations related to object data
   * @returns {EmptyResponse.model} 200 - Object successfully deleted
   * @returns {Message.model} 400 - Wrong schema id or schema deletion error
   * @returns {EmptyResponse.model} 404 - User object not found
   * @security cookieAuth
   */
  private deleteObjectHandler = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!this.isObjectIdValid(id)) {
      res.status(400).json({ message: 'Given id does not match correct format' });
      return;
    }
    const user = await extractUserFromCookies(req.cookies);
    const object = await findSchemaInstanceById(id);
    if (!object) {
      res.status(404).json({});
      return;
    }
    const schema = await findSchemaById(object.schemaId!);
    const permission = await this.permissionsToSchema(schema, user);
    if (!permission) {
      res.status(404).json({});
      return;
    }
    try {
      await deleteObject(id);
      res.status(200).json({});
    } catch (error) {
      if (error instanceof DeleteObjectError) {
        res.status(400).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  /**
   * @route PATCH /object/{id}
   * @group object - Operations related to object data
   * @param {ObjectUpdateDto.model} data.body.required - object update data
   * @returns {EmptyResponse.model} 200 - Object successfully saved
   * @returns {Message.model} 400 - Data in wrong format or schema validation did not pass
   * @returns {EmptyResponse.model} 404 - Object not found
   * @security cookieAuth
   */
  private updateObjectHandler = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const { error, value } = objectUpdateDtoSchema.validate(req.body);
    if (!this.isObjectIdValid(id) || error) {
      res.status(400).json({ message: 'Given data does not match correct format' });
      return;
    }
    const user = await extractUserFromCookies(req.cookies);
    const object = await findSchemaInstanceById(id);
    if (!object) {
      res.status(404).json({});
      return;
    }
    const schema = await findSchemaById(object.schemaId!);
    const permission = await this.permissionsToSchema(schema, user);
    if (!permission) {
      res.status(404).json({});
      return;
    }

    const dto = value as ObjectUpdateDto;
    try {
      await updateObject(dto, object, schema!, user);
      res.status(200).json({});
    } catch (error) {
      if (error instanceof SchemaValidationError || error instanceof UpdateObjectError) {
        res.status(400).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  /**
   * @route POST /object
   * @group object - Operations related to object data
   * @param {ObjectInsertDto.model} data.body.required - object insert data
   * @returns {SingleGetObjectListDto.model} 200 - Object successfully saved
   * @returns {Message.model} 400 - Data in wrong format or schema validation did not pass
   * @returns {EmptyResponse.model} 404 - User schema of given id not found
   * @security cookieAuth
   */
  private insertObjectHandler = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = objectInsertDtoSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: 'Provided data does not meet required format' });
      return;
    }
    const dto = value as ObjectInsertDto;
    const schema = await findSchemaById(dto.schemaId);
    const user = await extractUserFromCookies(req.cookies);
    const permission = await this.permissionsToSchema(schema, user);
    if (!permission) {
      res.status(404).json({});
      return;
    }
    try {
      const savedObject = await createObject(dto, schema!, user);
      res.status(200).json(this.parseSingleObjectDto(savedObject));
    } catch (error) {
      if (error instanceof SchemaValidationError) {
        res.status(400).json({ message: error.message });
        return;
      }
      throw error;
    }
  };

  private isObjectIdValid = (id: number) => !isNaN(id) && id > 0;

  private permissionsToSchema = async (schema: Schema | null, user: User): Promise<boolean> => {
    if (!schema) {
      return false;
    }
    const campaign = await findUserCampaignById(schema.campaignId, user);
    return !!campaign;
  };

  private parseSingleObjectDto = (object: SchemaInstance): SingleGetObjectListDto => ({
    id: object.id!,
    schemaId: object.schemaId!,
    title: object.title,
    imageBase64: object.image ? object.image.toString('base64') : null,
    metadataArray: object.metadataArray.map(item => ({
      sequenceNumber: item.sequenceNumber,
      value: item.value,
      type: item.type,
      fieldName: item.fieldName,
    })),
  });

  getRouter = (): Router => this.router;
}
