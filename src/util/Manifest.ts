import Endpoints from "./consts/endpoints";
import axios from "axios";
import Auth from "../lib/auth";
import IHeader from "./interfaces/IHeader";
import fs from "fs";

export default class ManifestHandler {
  public manifest: string;
  public build: string;
  public buildnumber: string;
  async pullManifest(): Promise<string[]> {
    const token = await Auth.launcherAuth();
    if (!token) { 
      return [ "Error.. No token exists!" ];
    }
    const headers: IHeader = {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded"
    };

    const request: IEpicGamesManifestResponse = (await axios.get(Endpoints.MANIFEST, { headers })).data;
    const manifest: string = request.items.MANIFEST.path.replace("Builds/Fortnite/CloudDir/", "").replace(".manifest", "");
    const build: string = request.buildVersion.split("++Fortnite+Release-").join("\n");
    const buildNumber: string = build.slice(0, 6);
    this.build = build;
    this.manifest = manifest;
    this.buildnumber = buildNumber;
    return [ manifest, build, buildNumber ];
  }
  async parseManifest(): Promise<IParseManifest> {
    const values = await this.pullManifest();
    const manifest = values[0];
    const build = values[1];
    const buildNumber = values[2];
  
    return { manifest: manifest, build: build, buildNumber: buildNumber };
  }
}

interface IEpicGamesManifestResponse {
  appName: string;
  labelName: string;
  buildVersion: string;
  catalogItemId: string;
  expires: string;
  items: IEpicGamesManifestItem
  assetId: string;
}

interface IEpicGamesManifestItem {
  MANIFEST: {
    signature: string;
    distribution: string;
    path: string;
    hash: string;
    additionalDistributions: Array<string>
  }
  CHUNKS: {
    signature: string;
    distribution: string;
    path: string;
    additionalDistributions: Array<string>
  }
}
interface IParseManifest {
  manifest: string,
  build: string,
  buildNumber: number | string
}
// export async function pullManifest(): Promise<string[]> {
//   const token = await Auth.launcherAuth();
//   const headers: any = {};
//   headers["X-EpicGames-Lanuage"] = "en";
//   headers["Authorization"] = "bearer " + token;
//   const requester = axios.create({
//     headers: headers,
//     responseType: "json",
//   });
//   const manifestreq = (await requester.get(Endpoints.MANIFEST)).data.items.MANIFEST.path;
//   const buildreq = (await requester.get(Endpoints.MANIFEST)).data.buildVersion;
//   // let manifest,build,buildNumber;
//   const manifest: string = manifestreq.toString().replace("Builds/Fortnite/CloudDir/", "").replace(".manifest", "");
//   const build: string = buildreq.toString().split("++Fortnite+Release-").join("\n");
//   const buildNumber: string = build.slice(0, 6);
//   return [ manifest, build, buildNumber ];
// }