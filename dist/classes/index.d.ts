/// <reference types="node" />
import { Readable } from "stream";
import prism from "prism-media";
export interface SearchOptions {
    service: Service;
    limit: number;
    type: "tracks" | "playlists" | "albums";
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
export interface Audio {
    url?: string;
    quality?: string;
    duration?: number;
    protocol?: string;
    mimeType?: string;
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
    id: string;
    queuedBy?: any;
    duration: number;
    durationTimestamp?: string;
    live: boolean;
    playlisted: boolean;
    service?: Service;
    thumbnail?: string;
    audio?: Array<Audio>;
    author?: Author;
    originalData?: any;
    constructor(data?: any);
    sing(seek?: number, extraArgs?: any[]): Promise<prism.FFmpeg>;
    bestAudio(): Promise<Audio>;
    setQueuedBy(queuedBy: any): void;
    fetchFullTrack(): Promise<void>;
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
    thumbnail?: string;
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