import * as fs from 'fs/promises';

// see issue: https://github.com/nodesecurity/eslint-plugin-security/issues/65
// eslint-disable-next-line security/detect-non-literal-fs-filename
export const loadImage = async (path: string): Promise<Buffer> => await fs.readFile(path);
