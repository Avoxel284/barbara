import { MusicPlaylist, MusicTrack } from "../../lib";
export declare const SOUNDCLOUD_URL_PATTERN: RegExp;
export declare function SoundCloud(url: string): Promise<MusicTrack | MusicPlaylist>;
export declare function SoundCloudSearch(query: string, limit?: number, type?: "tracks" | "playlists" | "albums"): Promise<MusicTrack[] | MusicPlaylist[]>;
//# sourceMappingURL=index.d.ts.map