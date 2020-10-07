import axios, { AxiosResponse } from "axios";
import Endpoints from "./consts/endpoints";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PastebinAPI = require("pastebin-js");
const pastebin = new PastebinAPI("6ea7a2746e8454709e886b05efac4c96");

interface ICloudStorage {
  uniqueFilename: string;
  filename: string;
  hash: string;
  hash256: string;
  length: number;
  contentType: string;
  uploaded: string;
  storageType: string;
  doNotCache: boolean;
}
export default class HotFixClient {
  /** 
   * @todo
  */ 
  private async getHotFixHash(auth: string, filename: string) {
    const headers: Record<string, string> = {
      Authorization: `bearer ${auth}`,
    };

    const cloudstorage = await axios({
      url: `${Endpoints.CLOUD_STORAGE}`,
      method: "GET",
      headers: headers,
    }).then((response: any) => {
      return response.data;
    });
    const cloudstorageRes: ICloudStorage[] = cloudstorage.data;
    const hash = cloudstorageRes.filter((file) => file.filename === filename)[0].hash;

    //const file = cloudstorage.filter((file: any) => file.filename.toLowerCase() === filename)[0];
    // console.log(file.uniqueFilename);
    return hash;
  }
  /**
   *
   * @param {string} auth Auth token
   * @param {string} filename Filename from something
   * @returns {Promise<string>} String of the filename
   */
  private async hotFixParser(auth: string, filename: string): Promise<string> {
    const headers: Record<string, string> = {
      Authorization: `bearer ${auth}`,
    };
    try {
      if (!filename.includes(".ini")) {
        filename = `${filename}.ini`;
      }
      const cloudstorage = await axios({
        url: `${Endpoints.CLOUD_STORAGE}`,
        method: "GET",
        headers: headers,
      });
      const cloudstorageRes: ICloudStorage[] = cloudstorage.data;
      const uniqueFilename = cloudstorageRes.filter((file) => file.filename === filename)[0].uniqueFilename;

      return uniqueFilename;
    } catch (e) {
      console.error(e);
      return "Could not find uniqueFilename or something broke";
    }
  }
  async client(auth: string, list: boolean, fileName?: string): Promise<string | string[]>{
    const headers: Record<string, string> = {
      Authorization: `bearer ${auth}`,
    };
    if (list) {
      const cloudStorageList: Array<Record<string, string>> = await axios({
        url: `${Endpoints.CLOUD_STORAGE}`,
        method: "GET",
        headers: headers,
      }).then((response: AxiosResponse) => {
        return response.data;
      });
      const list: Array<string> = [];
      for (let i = 0; i < cloudStorageList.length; i += 1) {
        list[i] = cloudStorageList[i].filename;
      }
      return list;
    } else {
      try {
        const uniqueFilename = await this.hotFixParser(auth, fileName);
        if (uniqueFilename === "Could not find uniqueFilename or something broke") {
          return "Something broke / Could not find Hotfix file";
        }
        const res = await axios({
          url: `${Endpoints.CLOUD_STORAGE}/${uniqueFilename}`,
          method: "GET",
          headers: headers,
        }).then((response: AxiosResponse) => {
          return response.data;
        });
        if (res.length <= 0) {
          return "Empty.";
        }
        const pastebinlink = pastebin
          .createPaste({
            text: res,
            title: "FortniteHotFix - " + fileName,
            expiration: "10M",
            format: "ini",
          })
          .then((data: any) => {
            return data;
          });
        return pastebinlink;
      } catch (error) {
        console.log(error);
      }
    }
  }
}





