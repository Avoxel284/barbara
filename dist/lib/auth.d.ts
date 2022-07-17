import { Service } from ".";
export declare function authenticateKey(key0: string): Promise<{
    SPOTIFY_CLIENTID: string;
    SPOTIFY_ACCESSTOKEN: any;
    SPOTIFY_TOKENEXPIRY: number;
    SPOTIFY_TOKENTYPE: any;
} | undefined>;
export declare function refreshTokens(service?: Service): Promise<void>;
//# sourceMappingURL=auth.d.ts.map