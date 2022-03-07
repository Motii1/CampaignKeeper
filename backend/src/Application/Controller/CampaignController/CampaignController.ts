import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import * as path from 'path';
import { provideUserCampaignList } from '../../../Domain/Campaign/Service/CampaignList';
import { createCampaign } from '../../../Domain/Campaign/Service/Create';
import { handleCampaignImagePersistance } from '../../../Domain/Campaign/Service/Image';
import {
  deleteUserCampaignById,
  findUserCampaignById,
  saveCampaign,
} from '../../../Infrastracture/Entity/Campaign/CampaignRepository';
import { authorization } from '../../Middleware/Auth/Authorization';
import { buildSingleImageUploader } from '../../Middleware/Upload/Image';
import { extractUserFromCookies } from '../../Util/Authorization';
import { loadImage } from '../../Util/Image';
import { IController } from '../IController';
import { CampaignInsertDto, campaignInsertDtoSchema } from './Dto/CampaignInsertDto';
import { CampaignUpdateDto, campaignUpdateDtoSchema } from './Dto/CampaignUpdateDto';
import { MAX_FILE_SIZE_LIMIT } from './Dto/Const';
import { GetCampaignListDto } from './Dto/GetCampaignListDto';

const IMAGE_FILE_FIELD_NAME = 'image-file';
const CAMPAIGN_IMAGE_DEFAULT_PATH = path.resolve(
  __dirname,
  path.join('..', '..', '..', 'Common', 'Image', 'Campaign.jpg')
);

enum CampaignRoutes {
  Image = '/image',
  List = '/list',
}

export class CampaignController implements IController {
  private router: Router;

  constructor() {
    this.router = Router();
    this.declareRoutes();
  }

  private declareRoutes = (): void => {
    this.router.get(
      `${CampaignRoutes.Image}/:id`,
      authorization,
      asyncHandler(this.getImageHandler)
    );
    this.router.put(
      `${CampaignRoutes.Image}/:id`,
      authorization,
      asyncHandler(this.uploadImageHandler)
    );
    this.router.patch('/:id', authorization, asyncHandler(this.updateCampaignHandler));
    this.router.post('/', authorization, asyncHandler(this.insertCampaignHandler));
    this.router.delete('/:id', authorization, asyncHandler(this.deleteCampaignHandler));
    this.router.get(CampaignRoutes.List, authorization, asyncHandler(this.getCampaignsHandler));
  };

  /**
   * @route GET /campaign/list
   * @group campaign - Operations related to campaign data
   * @returns {GetCampaignListDto.model} 200 - Success
   * @security cookieAuth
   */
  private getCampaignsHandler = async (req: Request, res: Response): Promise<void> => {
    const user = await extractUserFromCookies(req.cookies);
    const data = await provideUserCampaignList(user);
    const campaigns = await Promise.all(
      data.map(async item => {
        if (item.imageBase64) {
          return item;
        }
        const image = await this.loadCampaignDefaultImage();
        return { ...item, imageBase64: image.toString('base64') };
      })
    );
    res.status(200).json(<GetCampaignListDto>{ campaigns });
  };

  /**
   * @route DELETE /campaign/{id}
   * @group campaign - Operations related to campaign data
   * @returns {EmptyResponse.model} 200 - Campaign successfully deleted
   * @returns {EmptyResponse.model} 400 - Wrong campaign id
   * @security cookieAuth
   */
  private deleteCampaignHandler = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!this.isCampaignIdValid(id)) {
      res.status(400).json({});
      return;
    }
    const user = await extractUserFromCookies(req.cookies);
    await deleteUserCampaignById(id, user);
    res.status(200).json({});
  };

  /**
   * @route PATCH /campaign/{id}
   * @group campaign - Operations related to campaign data
   * @param {CampaignUpdateDto.model} data.body.required - campaign update data, provide null in field that you do not want to update
   * @returns {EmptyResponse.model} 200 - Campaign successfully saved
   * @returns {EmptyResponse.model} 400 - Data in wrong format
   * @returns {EmptyResponse.model} 404 - Campaign not found
   * @security cookieAuth
   */
  private updateCampaignHandler = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const { error, value } = campaignUpdateDtoSchema.validate(req.body);
    if (!this.isCampaignIdValid(id) || error) {
      res.status(400).json({});
      return;
    }
    const dto = value as CampaignUpdateDto;
    const user = await extractUserFromCookies(req.cookies);
    const campaign = await findUserCampaignById(id, user);
    if (!campaign) {
      res.status(404).json({});
      return;
    }
    const toSave = {
      ...campaign,
      name: dto.name ?? campaign.name,
      image: dto.imageBase64 ? Buffer.from(dto.imageBase64, 'base64') : campaign.image,
    };
    await saveCampaign(toSave);
    res.status(200).json({});
  };

  /**
   * @route POST /campaign
   * @group campaign - Operations related to campaign data
   * @param {CampaignInsertDto.model} data.body.required - campaign insert data
   * @returns {SingleGetCampaignListDto.model} 200 - Campaign successfully saved
   * @returns {EmptyResponse.model} 400 - Data in wrong format
   * @security cookieAuth
   */
  private insertCampaignHandler = async (req: Request, res: Response): Promise<void> => {
    const { error, value } = campaignInsertDtoSchema.validate(req.body);
    if (error) {
      res.status(400).json({});
      return;
    }
    const dto = value as CampaignInsertDto;
    const user = await extractUserFromCookies(req.cookies);
    const response = await createCampaign(dto, user);
    res.status(200).json({
      ...response,
      imageBase64:
        response.imageBase64 ?? (await this.loadCampaignDefaultImage()).toString('base64'),
    });
  };

  /**
   * @route GET /campaign/image/{id}
   * @group campaign - Operations related to campaign data
   * @produces image/*
   * @returns {file} 200 - Campaign image or placeholder if avatar is not set
   * @returns {EmptyResponse.model} 400 - Wrong campaign id
   * @returns {EmptyResponse.model} 404 - Campaign is not found
   * @security cookieAuth
   */
  private getImageHandler = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (!this.isCampaignIdValid(id)) {
      res.status(400).json({});
      return;
    }
    const user = await extractUserFromCookies(req.cookies);
    const campaign = await findUserCampaignById(id, user);
    if (!campaign) {
      res.status(404).json({});
      return;
    }
    const image = campaign.image ?? (await this.loadCampaignDefaultImage());
    res.end(image, 'binary');
  };

  /**
   * @route PUT /campaign/image/{id}
   * @group campaign - Operations related to campaign data
   * @consumes multipart/form-data
   * @param {file} image-file.formData - image
   * @returns {EmptyResponse.model} 200 - Image succesfully saved
   * @returns {Message.model} 400 - Invalid file provided or wrong campaign id
   * @returns {EmptyResponse.model} 404 - Campaign is not found
   * @security cookieAuth
   */
  private uploadImageHandler = async (req: Request, res: Response): Promise<void> => {
    const { file, error } = await buildSingleImageUploader(
      MAX_FILE_SIZE_LIMIT,
      IMAGE_FILE_FIELD_NAME
    )(req, res);
    const id = Number(req.params.id);
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }
    if (!this.isCampaignIdValid(id)) {
      res.status(400).json({ message: 'id should be positive' });
      return;
    }
    const user = await extractUserFromCookies(req.cookies);
    const campaign = await findUserCampaignById(id, user);
    if (!campaign) {
      res.status(404).json({});
      return;
    }
    await handleCampaignImagePersistance(file!, id);
    res.status(200).json({});
  };

  private loadCampaignDefaultImage = async (): Promise<Buffer> =>
    await loadImage(CAMPAIGN_IMAGE_DEFAULT_PATH);

  private isCampaignIdValid = (id: number) => !isNaN(id) && id > 0;

  getRouter = (): Router => this.router;
}
