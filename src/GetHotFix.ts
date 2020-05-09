import axios from 'axios';
import Endpoints from './util/endpoints';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('6ea7a2746e8454709e886b05efac4c96');

export async function hotFixClient(path: string, auth: string) {
  const headers: any = {};
  headers['Authorization'] = `bearer ${auth}`;
  headers['Content-Type'] = 'application/octet-stream';
  let res;
  try {
    await axios({
      url: `${Endpoints.CLOUD_STORAGE}/${path}`,
      method: 'GET',
      headers: headers,
    }).then((response: any) => {
      res = response.data;
    });
  } catch (error) {
    console.log(error);
  }
  //console.log(res);
  const pastebinlink = pastebin
    .createPaste({
      text: res,
      title: 'FN HOTFIX',
      expiration: '10M',
      format: 'ini',
    })
    .then((data: any) => {
      return data;
    });
  return pastebinlink;
}

export async function getHotFixHash(auth: string, filename: string) {
  const headers: any = {};
  headers['Authorization'] = `bearer ${auth}`;
  let res;

  const cloudstorage = await axios({
    url: `${Endpoints.CLOUD_STORAGE}`,
    method: 'GET',
    headers: headers,
  }).then((response: any) => {
    return response.data;
  });

  const file = cloudstorage.filter((file: any) => file.filename.toLowerCase() === filename)[0];
  // console.log(file.uniqueFilename);
  return file.hash;
}
/**
 *
 * @param {string} auth Auth token in string
 * @param {string} filename Filename from something
 * @returns {string} String of the filename
 */
export async function hotFixParser(auth: string, filename: string) {
  const headers: any = {};
  headers['Authorization'] = `bearer ${auth}`;
  let res;

  const cloudstorage = await axios({
    url: `${Endpoints.CLOUD_STORAGE}`,
    method: 'GET',
    headers: headers,
  }).then((response: any) => {
    return response.data;
  });

  const file = cloudstorage.filter((file: any) => file.filename.toLowerCase() === filename)[0];
  //console.log(file.uniqueFilename);
  return file.uniqueFilename;
}
