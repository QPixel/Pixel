
declare module 'fnmultipurposebot' {
    export interface OperationResult {
        success: boolean | string;
        error: any;
      }

    export interface AuthPlatform {
        type: string;
        externalAuthId: string;
        accountId: string;
        externalDisplayName: string;
        authIds: AuthId[];
      }   

    export interface AuthData {
    expires_at?: string;
    access_token?: string;
    refresh_token?: string;
    account_id?: string;
    perms?: string;
  }
  export class Auth {
      constructor (index:Index);

      index: Index;

      launcherAuth(): any;
      login(): OperationResult;
      getOAuthToken();
      getOAuthExchangeToken(token: string): any;
  }
  export class Index {
      
      auth: Auth;

      pullManifest(): any
      start(): any;
  }
}