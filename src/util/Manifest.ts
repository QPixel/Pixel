import Endpoints from "./consts/endpoints";
import axios from "axios";
import Auth from "../lib/auth";
import IHeader from "./interfaces/IHeader";
import fs from "fs";
// import Client from "../client";

export default class ManifestHandler {
  constructor (private auth: Auth) {

  }
  public manifest: string;
  public build: string;
  public buildnumber: string;
  async pullManifest(): Promise<string[]> {
    const token = await this.auth.launcherAuth();
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