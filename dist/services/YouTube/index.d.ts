import { BarbaraType, MusicPlaylist, MusicTrack } from "../../classes";
export declare function YouTube(url: string): Promise<MusicTrack | MusicPlaylist>;
export declare function YouTubeSearch(query: string, limit: number, type?: "video" | "playlist"): Promise<BarbaraType[]>;
//# sourceMappingURL=index.d.ts.map