/**
 * Avoxel284 2022
 * Barbara Music Module
 */

import {
	MusicTrack,
	MusicPlaylist,
	SearchOptions,
	Service,
	Audio,
	Author,
	Queue,
	MusicTrackConstructor,
	MusicPlaylistConstructor,
} from "./lib";
import { SoundCloud, SoundCloudSearch, SOUNDCLOUD_URL_PATTERN } from "./services/SoundCloud";
import { YouTube, YouTubeSearch } from "./services/YouTube";
import { Spotify, SpotifySearch, SPOTIFY_URL_PATTERN } from "./services/Spotify";
import { setKey, freeKeys, getKey, setKeyFile } from "./lib/config";
import { AudioFile, AUDIOFILE_URL_PATTERN } from "./services/Arbitrary";
import { debugLog } from "./lib/util";

/**
 * Searches for tracks with given query on SoundCloud, unless other service and type is specified in search options.
 *
 * @param query Search query
 * @param options Search options
 * @returns Array of MusicTrack or MusicPlaylist objects
 */
export async function search(
	query: string,
	options: SearchOptions
): Promise<MusicTrack[] | MusicPlaylist[]> {
	let type: any;

	options ??= {
		service: Service.soundcloud,
		type: "tracks",
	};

	switch (options.service) {
		case Service.soundcloud:
			return await SoundCloudSearch(query, options.limit, options.type);
			break;

		case Service.spotify:
			if (options.type == "albums") type = "album";
			if (options.type == "playlists") type = "playlist";
			if (options.type == "tracks") type = "track";
			return await SpotifySearch(query, options.limit, type);
			break;

		case Service.youtube:
			if (options.type == "albums") throw new Error("Albums do not exist on YouTube");
			if (options.type == "playlists") type = "playlist";
			if (options.type == "tracks") type = "video";
			return await YouTubeSearch(query, options.limit, type);
			break;
	}

	throw new Error("Invalid service");
}

/**
 * Validate and get the service from a given URL.
 *
 * @returns Service or undefined
 */
export async function serviceFromURL(url: string): Promise<Service | undefined> {
	url = url.trim();
	if (url.length === 0) return;
	if (url.match(SOUNDCLOUD_URL_PATTERN)) return Service.soundcloud;
	if (url.match(SPOTIFY_URL_PATTERN)) return Service.spotify;
	if (url.match(AUDIOFILE_URL_PATTERN)) return Service.audiofile;
}

/**
 * Automatically matches and returns a MusicTrack or MusicPlaylist from a given service URL
 *
 * @example
 * ```
 * barbara.info("").then((track) => {
 *
 * })
 * ```
 */
export async function info(url: string): Promise<MusicTrack | MusicPlaylist> {
	url = url.trim();
	let service = await serviceFromURL(url);
	if (!url) throw "URL empty";
	debugLog(`Getting info from ${url} :: Detected service: ${service}`);

	switch (service) {
		case Service.soundcloud:
			return SoundCloud(url).catch((err) => {
				throw err;
			});

		case Service.spotify:
			return Spotify(url);
			break;

		case Service.youtube:
			return YouTube(url);
			break;

		case Service.audiofile:
			return AudioFile(url, {});
			break;
	}

	throw new Error("Invalid service");
}

export { MusicTrack, MusicPlaylist };
export { SearchOptions, Audio, Author, MusicTrackConstructor, MusicPlaylistConstructor };
export { Service };
// export { SoundCloud };
// export { Spotify };
export { setKey, freeKeys, getKey, setKeyFile };
// export { YouTube, YouTubeSearch };
