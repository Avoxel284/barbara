import { MusicPlaylist, MusicTrack } from "../../lib";
export declare const SPOTIFY_URL_PATTERN: RegExp;
export declare function Spotify(url: string): Promise<MusicTrack | MusicPlaylist>;
export declare function SpotifySearch(query: string, limit?: number, type?: "track" | "playlist" | "album"): Promise<any>;
//# sourceMappingURL=index.d.ts.map