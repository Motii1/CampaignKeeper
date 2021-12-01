// definitions need to be placed like that, because of the library used for documentation generation
/**
 * @typedef EmptyResponse
 */
/**
 * @typedef Message
 * @property {string} message
 */

export type EmptyResponse = Record<string, never>;

export type Message = { message: string };
