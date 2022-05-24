import { MusicTrack, SearchOptions, Service, InfoOptions } from "./classes";
import { SoundCloud } from "./services/SoundCloud";

/**
 * Searches given keywords on YouTube, unless other service is specified in search options.
 * @returns Array of MusicTrack objects
 */
export async function search(keywords: string, options: SearchOptions) {
	return keywords;
}

/**
 * Automatically matches URL and returns information about the music track
 * @returns MusicTrack object
 */
export async function info(url: string, options: InfoOptions) {}

export { MusicTrack, SearchOptions, Service, SoundCloud };
