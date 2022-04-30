import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authorization } from '../../Middleware/Auth/Authorization';
import { IController } from '../IController';

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
    this.router.patch('/:id', authorization, asyncHandler(this.updateObjectHandler));
    this.router.post('/', authorization, asyncHandler(this.insertObjectHandler));
    this.router.delete('/:id', authorization, asyncHandler(this.deleteObjectHandler));
    this.router.get(ObjectRoutes.List, authorization, asyncHandler(this.getObjectsHandler));
    this.router.get('/:id', authorization, asyncHandler(this.getSingleObjectHandler));
  };

  /**
   * @route GET /object/:id
   * @group object - Operations related to object data
   * @returns {SingleGetObjectListDto.model} 200 - Success
   * @returns {EmptyResponse.model} 400 - Wrong data format
   * @returns {EmptyResponse.model} 404 - Schema not found
   * @security cookieAuth
   */
  private getSingleObjectHandler = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      id: 1,
      title: 'Dude Duderer',
      fields: [
        ['Name', [{ type: 'string', value: 'There is no name' }]],
        [
          'Friends',
          [
            { type: 'string', value: 'Dead guy with funny eyes' },
            { type: 'string', value: 'Guy with a gun' },
          ],
        ],
        ['Race', [{ type: 'string', value: 'Unemployed american' }]],
        ['Look', [{ type: 'string', value: 'Take a look at the pic' }]],
        [
          'Affilations',
          [
            { type: 'string', value: 'Probably Germans' },
            { type: 'id', value: 2 },
          ],
        ],
      ],
    });
  };

  /**
   * @route GET /object/list
   * @group object - Operations related to object data
   * @param {number} schemaId.query.required - id of schema
   * @returns {GetObjectListDto.model} 200 - Success
   * @returns {EmptyResponse.model} 400 - Wrong data format
   * @returns {EmptyResponse.model} 404 - Schema not found
   * @security cookieAuth
   */
  private getObjectsHandler = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      objects: [
        {
          id: 1,
          title: 'Dude Duderer',
          fields: [
            ['Name', [{ type: 'string', value: 'There is no name' }]],
            [
              'Friends',
              [
                { type: 'string', value: 'Dead guy with funny eyes' },
                { type: 'string', value: 'Guy with a gun' },
              ],
            ],
            ['Race', [{ type: 'string', value: 'Unemployed american' }]],
            ['Look', [{ type: 'string', value: 'Take a look at the pic' }]],
            [
              'Affilations',
              [
                { type: 'string', value: 'Probably Germans' },
                { type: 'id', value: 2 },
              ],
            ],
          ],
        },
      ],
    });
  };

  /**
   * @route DELETE /object/{id}
   * @group object - Operations related to object data
   * @returns {EmptyResponse.model} 200 - Object successfully deleted
   * @returns {EmptyResponse.model} 400 - Wrong schema id
   * @returns {EmptyResponse.model} 404 - User object not found
   * @security cookieAuth
   */
  private deleteObjectHandler = async (req: Request, res: Response): Promise<void> => {
    // @todo object deleted!!
    res.status(200).json({});
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
    // @todo object updated!!!
    res.status(200).json({});
  };

  /**
   * @route POST /object
   * @group object - Operations related to object data
   * @param {ObjectInsertDto.model} data.body.required - object insert data
   * @returns {SingleGetObjectListDto.model} 200 - Object successfully saved
   * @returns {Message.model} 400 - Data in wrong format or schema validation did not pass
   * @returns {EmptyResponse.model} 404 - User campaign of given id not found
   * @security cookieAuth
   */
  private insertObjectHandler = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      id: 1,
      title: 'Dude Duderer',
      fields: [
        ['Name', [{ type: 'string', value: 'There is no name' }]],
        [
          'Friends',
          [
            { type: 'string', value: 'Dead guy with funny eyes' },
            { type: 'string', value: 'Guy with a gun' },
          ],
        ],
        ['Race', [{ type: 'string', value: 'Unemployed american' }]],
        ['Look', [{ type: 'string', value: 'Take a look at the pic' }]],
        [
          'Affilations',
          [
            { type: 'string', value: 'Probably Germans' },
            { type: 'id', value: 2 },
          ],
        ],
      ],
    });
  };

  getRouter = (): Router => this.router;
}
