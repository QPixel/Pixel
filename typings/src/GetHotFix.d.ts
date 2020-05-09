export declare function hotFixClient(path: string, auth: string): Promise<any>;
export declare function getHotFixHash(auth: string, filename: string): Promise<any>;
/**
 *
 * @param {string} auth Auth token in string
 * @param {string} filename Filename from something
 * @returns {string} String of the filename
 */
export declare function hotFixParser(auth: string, filename: string): Promise<any>;
