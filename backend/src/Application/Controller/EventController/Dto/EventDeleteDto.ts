/**
 * @typedef EventDeleteDto
 * @property {string} parentId - new parent for deleted node children
 */

import * as Joi from 'joi';

export type EventDeleteDto = { parentId?: number };

export const eventDeleteDtoSchema = Joi.object<EventDeleteDto>({
  parentId: Joi.number().min(0),
});
