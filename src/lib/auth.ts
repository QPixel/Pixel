import axios from "axios";
import tokens from "../util/consts/tokens";
import Endpoints from "../util/consts/endpoints";
import { stringify } from "querystring";
import fs from "fs";
const fsPromises = fs.promises;

export default class Auth {
  private static access_token: string;
  private deviceAuthPath = `${__dirname}/deviceAuthDetails.json`;
  private authCode?: string;
  /**
   *
   * @param {string} authType - createDeviceAuth or normalStartUp
   * @param {string} authcode authorizationCode
   */
  constructor(authType: string, authcode?: string) {
    this.authCode = authcode;
    switch (authType) {
    case "createDeviceAuth":
      this.handleDeviceAuth(true);
      break;
    case "normalStartUp":
      this.handleDeviceAuth(false);
      break;
    }
  }
  static async launcherAuth(): Promise<string> {
    return await this.getOAuthToken("client_credentials");
  }

  private async handleDeviceAuth(createNew: boolean): Promise<void> {
    if (createNew) {
      const deviceAuth = await this.GenerateDeviceAuth();
      Auth.access_token = await Auth.getOAuthToken("device_auth", deviceAuth);
    } else {
      console.log("[AUTH] Reading DeviceAuth file");
      let deviceAuthBuffer: DeviceAuth;
      let deviceAuthFile;
      try {
        deviceAuthFile = await fsPromises.readFile(this.deviceAuthPath, { encoding: "utf8" });
      } catch (e) {
        console.error(e);
        return this.handleDeviceAuth(true);
      }
      if (deviceAuthFile.length !== 0) {
        deviceAuthBuffer = JSON.parse(deviceAuthFile);
      } else {
        return this.handleDeviceAuth(true);
      }
      Auth.access_token = await Auth.getOAuthToken("device_auth", deviceAuthBuffer);
    }
  }
  /*  
   Creates a device auth based off of authorization_code grant type
  */
  private async GenerateDeviceAuth(): Promise<DeviceAuth> {
    console.log("[AUTH] Creating Device Auth");
    const tempAccessToken = (
      await axios.post(Endpoints.OAUTH_TOKEN, stringify({ grant_type: "authorization_code", code: this.authCode }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `basic ${tokens.fortniteToken}`,
        },
        responseType: "json",
      })
    ).data.access_token;
    const exchangeCode = (
      await axios.get(Endpoints.OAUTH_EXCHANGE, {
        headers: {
          Authorization: `bearer ${tempAccessToken}`,
        },
      })
    ).data.code;
    const iosToken = (
      await axios.post(Endpoints.OAUTH_TOKEN, stringify({ grant_type: "exchange_code", exchange_code: exchangeCode }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `basic ${tokens.switchToken}`,
        },
        responseType: "json",
      })
    ).data;

    const deviceAuthReq = (
      await axios.post(
        `${Endpoints.DEVICE_AUTH}/${iosToken.account_id}/deviceAuth`,
        {},
        {
          headers: {
            Authorization: `bearer ${iosToken.access_token}`,
          },
          responseType: "json",
        },
      )
    ).data;

    const deviceAuthDetails: DeviceAuth = {
      accountId: deviceAuthReq.accountId,
      deviceId: deviceAuthReq.deviceId,
      secret: deviceAuthReq.secret,
      created: deviceAuthReq.created
    };

    try {
      console.log("[AUTH] Writing Auth Details....");
      await fsPromises.writeFile(this.deviceAuthPath, JSON.stringify(deviceAuthDetails));
    } catch (e) {
      console.error("[AUTH] There was an issue writing Device Auth Details\n");
      console.error(e);
    }
    return deviceAuthDetails;
  }
  private static async getOAuthToken(grantType: string, deviceAuthDetails?: DeviceAuth): Promise<string> {
    switch (grantType) {
    case "client_credentials": {
      const client_credentials = await axios.post(
        Endpoints.OAUTH_TOKEN,
        stringify({ grant_type: "client_credentials", token_type: "eg1" }),
        {
          headers: {
            Authorization: `basic ${tokens.launcherToken}`,
          },
        },
      );
      return client_credentials.data.access_token;
    }
    case "device_auth": {
      console.log("[AUTH] Requesting OAuthToken using DeviceAuth");
      const deviceAuth = await axios.post(
        Endpoints.OAUTH_TOKEN,
        stringify({
          grant_type: "device_auth",
          account_id: deviceAuthDetails.accountId,
          device_id: deviceAuthDetails.deviceId,
          secret: deviceAuthDetails.secret,
        }),
        {
          headers: {
            Authorization: `basic ${tokens.switchToken}`,
          },
        },
      );
      console.log(deviceAuth.data);
      // console.log(deviceAuth.config);
      
      return deviceAuth.data.access_token;
    }
    }
  }
  
  public static get accessToken(): string {
    return this.access_token;
  }
}

export interface DeviceAuth {
  accountId: string;
  deviceId: string;
  secret: string;
  created: Record<string, string>
}
