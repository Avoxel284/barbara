import { MusicPlaylist, MusicTrack } from "../../lib";
export declare const SOUNDCLOUD_URL_PATTERN: RegExp;
export declare function SoundCloud_Info(url: string): Promise<MusicTrack | MusicPlaylist>;
export declare function SoundCloud_Search(query: string, limit?: number, type?: "tracks" | "playlists" | "albums"): Promise<MusicTrack[] | MusicPlaylist[]>;
export declare function SoundCloud_Validate(url: string): RegExpMatchArray | null;
//# sourceMappingURL=index.d.ts.map