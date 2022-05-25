export interface SearchOptions {
    service: Service;
}
export interface InfoOptions {
    length: number;
}
export declare type BarbaraType = MusicTrack | MusicPlaylist;
export declare enum Service {
    spotify = "spotify",
    youtube = "youtube",
    soundcloud = "soundcloud",
    audiofile = "audiofile"
}
interface Audio {
    url?: string;
    quality?: string;
    duration?: number;
    protocol?: string;
    mimeType?: string;
}
interface Thumbnail {
    url: string;
}
interface Author {
    url?: string;
    avatar?: string;
    name?: string;
    id?: string;
    verified?: boolean;
}
export declare class MusicTrack {
    url: string;
    name: string;
    queuedBy?: string;
    duration: number;
    durationTimestamp?: string;
    playlisted: boolean;
    service?: Service;
    thumbnail?: Thumbnail;
    audio?: Array<Audio>;
    author?: Author;
    originalData?: any;
    constructor(data?: any);
}
export declare class MusicPlaylist {
    url?: string;
    name?: string;
    isAlbum?: boolean;
    tracks?: Array<MusicTrack>;
    author?: Author;
    constructor(data?: any);
}
export {};
//# sourceMappingURL=index.d.ts.map