import { MusicTrack, MusicPlaylist, SearchOptions, Service, Audio, Author, MusicTrackConstructor, MusicPlaylistConstructor } from "./lib";
import { setKey, freeKeys, getKey, setKeyFile } from "./lib/config";
export declare function search(query: string, options: SearchOptions): Promise<any>;
export declare function serviceFromURL(url: string): Promise<Service | undefined>;
export declare function info(url: string): Promise<MusicTrack | MusicPlaylist>;
export { MusicTrack, MusicPlaylist };
export { SearchOptions, Audio, Author, MusicTrackConstructor, MusicPlaylistConstructor };
export { Service };
export { setKey, freeKeys, getKey, setKeyFile };
//# sourceMappingURL=index.d.ts.map