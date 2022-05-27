import { MusicTrack, SearchOptions, Service, InfoOptions } from "./classes";
import { SoundCloud, SoundCloudSearch } from "./services/SoundCloud";
import { YouTubeSearch, YouTube } from "./services/YouTube";

/**
 * Searches given keywords on YouTube, unless other service is specified in search options.
 *
 * @param query Search query
 * @param options Search options
 * @returns Array of MusicTrack objects
 */
export async function search(query: string, options: SearchOptions) {
	if (options.service === Service.soundcloud) {
		return await SoundCloudSearch(query, options.limit, options.type);
	}
	// return query;
}

/**
 * Automatically matches URL and returns information about the music track
 * @returns MusicTrack object
 */
export async function info(url: string, options: InfoOptions) {}

export { MusicTrack, SearchOptions, Service };
export { SoundCloud, SoundCloudSearch };
export { YouTube, YouTubeSearch };
