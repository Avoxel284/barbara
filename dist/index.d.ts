import { MusicTrack, MusicPlaylist, SearchOptions, Service, Audio, Author, MusicTrackConstructor, MusicPlaylistConstructor } from "./lib";
import { setKey, freeKey, getKey, setKeyFile } from "./lib/config";
export declare function search(query: string, options?: SearchOptions): Promise<MusicTrack[] | MusicPlaylist[]>;
export declare function serviceFromURL(url: string): Promise<Service | undefined>;
export declare function info(url: string): Promise<MusicTrack | MusicPlaylist>;
export { MusicTrack, MusicPlaylist };
export { SearchOptions, Audio, Author, MusicTrackConstructor, MusicPlaylistConstructor };
export { Service };
export { setKey, freeKey as freeKeys, getKey, setKeyFile };
//# sourceMappingURL=index.d.ts.map