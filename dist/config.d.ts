export declare type BarbaraKey = "SOUNDCLOUD_CLIENTID" | "SPOTIFY_APIKEY";
export declare function getKey(key: BarbaraKey): string;
export declare function setKey(key: BarbaraKey, value: string): void;
export declare function setKeyFile(path: string): void;
export declare function isDebug(): boolean;
export declare function freeKeys(key: BarbaraKey): Promise<any>;
//# sourceMappingURL=config.d.ts.map