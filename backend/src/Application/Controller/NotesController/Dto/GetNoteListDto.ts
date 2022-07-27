/**
 * @typedef SingleGetNoteListDto
 * @property {number} id - id of the event
 * @property {string} value - value of the note
 */
/**
 * @typedef GetNoteListDto
 * @property {Array.<SingleGetNoteListDto>} notes - array of notes dto data
 */

export type SingleGetNoteListDto = {
  id: number;
  value: string;
};
