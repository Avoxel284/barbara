import prism from "prism-media";
export interface SearchOptions {
    service: Service;
    limit?: number;
    type: "tracks" | "playlists" | "albums";
}
export declare type BarbaraType = MusicTrack | MusicPlaylist;
export declare enum Service {
    spotify = "spotify",
    youtube = "youtube",
    soundcloud = "soundcloud",
    audiofile = "audiofile"
}
export interface Audio {
    url: string;
    quality?: string;
    duration?: number;
    protocol?: string;
    mimeType: string;
    bitrate?: number;
    codec?: string;
}
export interface Author {
    url?: string;
    avatar?: string;
    name?: string;
    id?: string;
    verified?: boolean;
}
export interface MusicTrackConstructor {
    name: string;
    url: string;
    id?: string;
    thumbnail: string;
    author: Author[] | Author;
    queuedBy?: any;
    duration: number;
    live?: boolean;
    explicit?: any;
    playlisted?: boolean;
    service: Service;
    audio?: Audio[];
    originalData: any;
}
export declare class MusicTrack {
    url: string;
    name: string;
    id?: string;
    metadata: {
        queuedBy?: any;
        explicit?: boolean;
    };
    duration: number;
    durationTimestamp: string;
    live: boolean;
    playlisted: boolean;
    service: Service;
    thumbnail: string;
    audio: Audio[];
    author: Author[];
    originalData?: any;
    constructor(data: MusicTrackConstructor);
    resource(seek?: number, extraArgs?: any[]): Promise<prism.FFmpeg>;
    bestAudio(): Promise<Audio>;
    setQueuedBy(queuedBy: any): this;
    fetchFullTrack(): Promise<void>;
}
export interface MusicPlaylistConstructor {
    name: string;
    url: string;
    id?: string;
    thumbnail: string;
    author: Author[] | Author;
    duration: number;
    queuedBy?: any;
    isAlbum?: boolean;
    tracks: MusicTrack[];
    collaborative?: boolean;
    service: Service;
    originalData: any;
}
export declare class MusicPlaylist {
    url: string;
    name: string;
    id?: string;
    metadata: {
        queuedBy?: any;
        collaborative?: boolean;
    };
    duration: number;
    durationTimestamp: string;
    isAlbum: boolean;
    tracks: MusicTrack[];
    author: Author[];
    service: Service;
    thumbnail?: string;
    originalData?: any;
    constructor(data: MusicPlaylistConstructor);
    setQueuedBy(queuedBy: any): this;
}
export declare class Queue {
    constructor(data?: any);
}
//# sourceMappingURL=index.d.ts.map