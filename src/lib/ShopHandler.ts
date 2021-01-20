import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Logger } from "winston";
import endpoints from "../util/consts/endpoints";
import Auth from "./auth";


interface CatalogRequest {
  refreshIntervalHrs: number;
  dailyPurchaseHrs: number;
  expiration: Date;
  storefronts: Array<Record<string, string>>;
}

enum Purchase {
  Completed,
  NotCompleted,
  Error
}

export default class ShopHandler {
  // private RequestConfig: AxiosRequestConfig;
  // private authToken: string;
  // private axiosInstance: AxiosInstance = axios.create();
  constructor (private auth: Auth, private logger: Logger) {}
  public async getShop(): Promise<void> {
    const authToken = this.auth.accessToken;
    // this.axiosInstance.defaults.headers = {
    //   authorization: `bearer ${authToken}`
    // };
    console.log(authToken);
    try {
      // const request = await this.axiosInstance.get(`${endpoints.STOREFRONT}`, { responseType: "json" });
      const request = await axios.get(endpoints.STOREFRONT, { headers: { authorization: `bearer ${authToken}` }, responseType: "json" });
      console.log(request.request);
      // return await (await this.axiosInstance.get(`${endpoints.PUBLIC_BASE_URL}storefront/v2/catalog`)).data as CatalogRequest;
    } catch (error) {
      if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
        this.logger.error(error.response.data);
        this.logger.error(error.response.status);
        this.logger.error(error.response.headers);
      } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
        this.logger.error(error.request);
      } else {
      // Something happened in setting up the request that triggered an Error
        this.logger.error("Error", error.message);
      }
      this.logger.error(error.config);
    }
    // const request: AxiosResponse | AxiosError = await this.axiosInstance.get(`${endpoints.PUBLIC_BASE_URL}storefront/v2/catalog`).then((response) => {return response;}).catch((err) => {
    //   this.logger.error(err);
    //   return err;
    // });
    // const data: CatalogRequest = request.;
    // console.log(data.storefronts);
    // return data;
  }
  // public async makePurchase(): Promise<Purchase> {

  // }
}

class ShopUtils {
    
}