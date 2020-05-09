/**
 * Performs the auth for the launcher
 * @returns {string} string of the auth result
 */
export declare function launcherAuth(): Promise<undefined>;
export declare class Auth {
    userAgent: string;
    GenerateDeviceAuth(code: any): Promise<{
        accountId: any;
        deviceId: any;
        secret: any;
    }>;
    getDeviceAuth(exchange: string): Promise<any>;
    /**
     * Get OAuth Token for Fortnite Game access
     * @param {string} exchange Token from getOAuthExchangeToken()
     * @returns {object} JSON Object of result
     */
    getFortniteOAuthToken(exchange: any): Promise<any>;
    /**
     *
     * @param {string} token access_token from login data
     * @returns {object} Json objext of result
     */
    getOAuthExchangeToken(token: any): Promise<any>;
    login(fixAuth: boolean, exchangeCode: string): Promise<any>;
}
