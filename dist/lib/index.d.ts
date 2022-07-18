import prism from "prism-media";
export interface SearchOptions {
    service?: Service;
    limit?: number;
    type?: "tracks" | "videos" | "playlists" | "albums";
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
export interface GeniusSong {
    lyrics?: string[];
    url: string;
    pyongs?: number;
    title: string;
    name: string;
    artist: Author;
    thumbnail: string;
    id: number;
    lyricsState: string;
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
    resolvedTo?: Service;
    service: Service;
    audio?: Audio[];
    originalData: any;
}
export declare class MusicTrack {
    url: string;
    name: string;
    metadata: {
        queuedBy?: any;
        explicit?: boolean;
        id?: string;
        resolvedTo: Service | false;
    };
    duration: number;
    durationTimestamp: string;
    live: boolean;
    playlisted: boolean;
    service: Service;
    thumbnail: string;
    audio: Audio[];
    authors: Author[];
    originalData?: any;
    constructor(data: MusicTrackConstructor);
    resource(seek?: number, extraArgs?: any[], audio?: Audio): Promise<prism.FFmpeg>;
    bestAudio(): Promise<Audio>;
    fetchMissingAudio(): Promise<void>;
    resolveUnstreamableTrack(): Promise<{
        query: string;
        result: MusicTrack;
    } | undefined>;
    getGeniusSong(): Promise<GeniusSong | null>;
    setQueuedBy(queuedBy: any): this;
}
export interface MusicPlaylistConstructor {
    name: string;
    url: string;
    id?: string;
    thumbnail: string;
    authors: Author[] | Author;
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
    metadata: {
        queuedBy?: any;
        collaborative?: boolean;
        id?: string;
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
export interface QueueConstructor {
    id: string;
}
export declare class Queue {
    constructor(data?: any);
}
//# sourceMappingURL=index.d.ts.map