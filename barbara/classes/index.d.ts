export interface SearchOptions {
    service: Service;
}
export interface InfoOptions {
    length: number;
}
export declare type BarbaraType = MusicTrack | MusicPlaylist;
export declare enum Service {
    spotify = 0,
    youtube = 1,
    soundcloud = 2,
    audiofile = 3
}
declare enum AudioQuality {
    low = 0,
    medium = 1,
    high = 2
}
interface Audio {
    url: string;
    quality: AudioQuality;
}
interface Thumbnail {
    url: string;
}
interface Author {
    url: string;
    avatar: string;
    name: string;
    id: string;
}
export declare class MusicTrack {
    url?: string;
    name?: string;
    queuedBy?: string;
    duration?: number;
    durationTimestamp?: string;
    playlisted?: boolean;
    service?: Service;
    thumbnail?: Thumbnail;
    audio?: Array<Audio>;
    author?: Author;
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