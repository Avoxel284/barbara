import { MusicTrack, MusicPlaylist, SearchOptions, Service, Audio, Author, MusicTrackConstructor, MusicPlaylistConstructor, GeniusSong } from "./lib";
import { setKey, freeKey, getKey, setKeyFile, setKeys } from "./lib/config";
import { searchGeniusSong, fetchGeniusSongLyrics } from "./lib/genius";
import { refreshTokens } from "./lib/auth";
export declare function search(query: string, options?: SearchOptions): Promise<MusicTrack[] | MusicPlaylist[]>;
export declare function serviceFromURL(url: string): Promise<Service | undefined>;
export declare function info(url: string): Promise<MusicTrack | MusicPlaylist>;
export { MusicTrack, MusicPlaylist };
export { SearchOptions, Audio, Author, MusicTrackConstructor, MusicPlaylistConstructor };
export { Service };
export { setKey, freeKey, getKey, setKeyFile, setKeys, refreshTokens };
export { searchGeniusSong, fetchGeniusSongLyrics, GeniusSong };
//# sourceMappingURL=index.d.ts.map