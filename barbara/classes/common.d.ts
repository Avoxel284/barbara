export declare enum Service {
    spotify = 0,
    youtube = 1,
    soundcloud = 2,
    audiofile = 3
}
interface Thumbnail {
    url: string;
}
export declare class MusicTrack {
    url?: string;
    name?: string;
    queuedBy?: string;
    duration?: number;
    playlisted?: boolean;
    service?: Service;
    thumbnail?: Thumbnail;
    audio?: Array<any>;
    constructor(data?: any);
}
export declare class MusicPlaylist {
    url: string;
    name: string;
    isAlbum: boolean;
    tracks: Array<MusicTrack>;
    constructor(url: string, tracks: Array<MusicTrack>, name: string, isAlbum: boolean);
}
export interface SearchOptions {
    service: Service;
}
export interface InfoOptions {
    length: number;
}
export {};
//# sourceMappingURL=common.d.ts.map