import { MusicTrack, SearchOptions, Service, InfoOptions } from "./classes";
import { SoundCloud, SoundCloudSearch } from "./services/SoundCloud";
export declare function search(query: string, options: SearchOptions): Promise<import("./classes").BarbaraType[] | undefined>;
export declare function info(url: string, options: InfoOptions): Promise<void>;
export { MusicTrack, SearchOptions, Service, SoundCloud, SoundCloudSearch };
//# sourceMappingURL=index.d.ts.map