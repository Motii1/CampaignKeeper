/**
 * @typedef SingleFieldValueDto
 * @property {enum} type - type values that are available: string, id
 * @property {[string, number]} value - Id of existing object or plain text
 */

export type FieldValue = [
  string,
  { type: 'string'; value: string } | { type: 'id'; value: number }
];
