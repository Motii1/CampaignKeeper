import { saveSchema } from '../../../Infrastracture/Entity/Schema/SchemaRepository';
import { Schema } from './Schema';

export const insertDefaultSchemas = async (campaignId: number): Promise<void> => {
  const schemas = getDefaultSchemas(campaignId);
  await Promise.all(schemas.map(saveSchema));
};

const getDefaultSchemas = (campaignId: number): Schema[] => {
  const NPC_DEFAULT_SCHEMA: Schema = {
    title: 'NPC',
    campaignId,
    fields: ['Name', 'Surname', 'Age', 'Occupation', 'Description', 'Character'],
  };

  const CITY_DEFAULT_SCHEMA: Schema = {
    title: 'City',
    campaignId,
    fields: ['Location', 'Country', 'Population', 'Ruler', 'Points of interest'],
  };

  return [NPC_DEFAULT_SCHEMA, CITY_DEFAULT_SCHEMA];
};
