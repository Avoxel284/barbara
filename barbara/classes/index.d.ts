/// <reference types="node" />
import { Readable } from "stream";
import prism from "prism-media";
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
    sing(seek?: number, extraArgs?: any[]): Promise<prism.FFmpeg>;
    bestAudio(): Promise<Audio>;
}
export declare class MusicPlaylist {
    url?: string;
    name?: string;
    duration?: number;
    durationTimestamp?: string;
    isAlbum?: boolean;
    tracks?: MusicTrack[];
    author?: Author;
    service?: Service;
    thumbnail?: Thumbnail;
    originalData?: any;
    constructor(data?: any);
}
export declare class BarbaraStream {
    stream?: Readable;
    service?: Service;
    url?: string;
    constructor(data?: any);
}
export {};
//# sourceMappingURL=index.d.ts.map