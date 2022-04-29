import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authorization } from '../../Middleware/Auth/Authorization';
import { IController } from '../IController';

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
    this.router.patch('/:id', authorization, asyncHandler(this.updateSchemaHandler));
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
    res.status(200).json({
      schemas: [
        {
          id: 1,
          title: 'NPC',
          deletable: false,
          fields: ['Name', 'Friends', 'Race', 'Look', 'Affilations'],
        },
        { id: 2, title: 'Hero', deletable: true, fields: ['Name', 'Items', 'Skills'] },
      ],
    });
  };

  /**
   * @route DELETE /schema/{id}
   * @group schema - Operations related to schema data
   * @returns {EmptyResponse.model} 200 - Schema successfully deleted
   * @returns {EmptyResponse.model} 400 - Wrong schema id
   * @returns {EmptyResponse.model} 404 - User schema not found
   * @security cookieAuth
   */
  private deleteSchemaHandler = async (req: Request, res: Response): Promise<void> => {
    // @todo schema deleted!!
    res.status(200).json({});
  };

  /**
   * @route PATCH /schema/{id}
   * @group schema - Operations related to schema data
   * @param {SchemaUpdateDto.model} data.body.required - schema update data
   * @returns {EmptyResponse.model} 200 - Schema successfully saved
   * @returns {EmptyResponse.model} 400 - Data in wrong format
   * @returns {EmptyResponse.model} 404 - Schema not found
   * @security cookieAuth
   */
  private updateSchemaHandler = async (req: Request, res: Response): Promise<void> => {
    // @todo schema updated!!!
    res.status(200).json({});
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
    res.status(200).json({
      id: 1,
      title: 'NPC',
      deletable: false,
      fields: ['Name', 'Friends', 'Race', 'Look', 'Affilations'],
    });
  };

  getRouter = (): Router => this.router;
}
