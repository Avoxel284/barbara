import { BarbaraType, MusicPlaylist, MusicTrack } from "../../classes";
export declare function getClientId(): Promise<string>;
export declare function SoundCloud(url: string): Promise<MusicTrack | MusicPlaylist>;
export declare function SoundCloudSearch(query: string, limit: number, type?: "tracks" | "playlists" | "albums"): Promise<BarbaraType[]>;
//# sourceMappingURL=index.d.ts.map