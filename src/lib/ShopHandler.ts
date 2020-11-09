import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
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
  private authToken: string;
  private axiosInstance: AxiosInstance = axios.create();
  
  public async getShop(authToken: string): Promise<CatalogRequest>  {
    if (authToken === this.authToken) { 
      console.log("no auth token lol");
    } else {
      this.authToken = authToken; 
    }
    this.axiosInstance.defaults.headers = {
      authorization: `bearer ${this.authToken}`
    };
    const request = await this.axiosInstance.get(`${endpoints.PUBLIC_BASE_URL}storefront/v2/catalog`);
    const data: CatalogRequest = request.data;
    console.log(data.storefronts);
    return data;
  }
  // public async makePurchase(): Promise<Purchase> {

  // }
}

class ShopUtils {
    
}