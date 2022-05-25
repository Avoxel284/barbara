import { MusicTrack, SearchOptions, Service, InfoOptions } from "./classes";
import { SoundCloud, SoundCloudSearch } from "./services/SoundCloud";
export declare function search(keywords: string, options: SearchOptions): Promise<string>;
export declare function info(url: string, options: InfoOptions): Promise<void>;
export { MusicTrack, SearchOptions, Service, SoundCloud, SoundCloudSearch };
//# sourceMappingURL=index.d.ts.map