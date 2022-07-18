import { MusicPlaylist, MusicTrack } from "../../lib";
export declare function YouTube_Info(url: string): Promise<MusicTrack | MusicPlaylist>;
export declare function YouTube_Search(query: string, limit?: number, type?: "video" | "playlist"): Promise<MusicTrack[] | MusicPlaylist[]>;
export declare function YouTube_Validate(url: string): true | undefined;
//# sourceMappingURL=index.d.ts.map