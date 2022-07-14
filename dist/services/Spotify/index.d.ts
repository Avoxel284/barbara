import { MusicPlaylist, MusicTrack } from "../../lib";
export declare const SPOTIFY_URL_PATTERN: RegExp;
export declare function Spotify_Info(url: string): Promise<MusicTrack | MusicPlaylist>;
export declare function Spotify_Search(query: string, limit?: number, type?: "track" | "playlist" | "album"): Promise<any>;
export declare function Spotify_Validate(url: string): RegExpMatchArray | null;
//# sourceMappingURL=index.d.ts.map