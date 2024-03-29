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
	GeniusSong,
} from "./lib";
import { SoundCloud_Info, SoundCloud_Search, SoundCloud_Validate } from "./services/SoundCloud";
import { YouTube_Info, YouTube_Search, YouTube_Validate } from "./services/YouTube";
import { Spotify_Info, Spotify_Search, Spotify_Validate } from "./services/Spotify";
import { setKey, freeKey, getKey, setKeyFile, setKeys } from "./lib/config";
import { AudioFile_Info, AudioFile_Validate } from "./services/Arbitrary";
import { debugLog } from "./lib/util";
import { searchGeniusSong, fetchGeniusSongLyrics } from "./lib/genius";
import { refreshTokens } from "./lib/auth";

/**
 * Searches for tracks with given query on SoundCloud, unless other service and type is specified in search options.
 *
 * Note: For YouTube, option.type = `tracks` and `videos` are the same thing.
 *
 * @param query Search query
 * @param options Search options
 * @returns Array of MusicTrack or MusicPlaylist objects
 */
export async function search(
	query: string,
	options: SearchOptions = {}
): Promise<MusicTrack[] | MusicPlaylist[]> {
	let type: any;
	options.limit ??= 1;
	options.service ??= Service.youtube;
	options.type ??= "tracks";

	switch (options.service) {
		case Service.soundcloud:
			if (options.type == "videos") throw new Error("Videos do not exist on SoundCloud");
			return await SoundCloud_Search(query, options.limit, options.type);
			break;

		case Service.spotify:
			if (options.type == "videos") throw new Error("Videos do not exist on Spotify");
			if (options.type == "albums") type = "album";
			if (options.type == "playlists") type = "playlist";
			if (options.type == "tracks") type = "track";
			return await Spotify_Search(query, options.limit, type);
			break;

		case Service.youtube:
			if (options.type == "albums") throw new Error("Albums do not exist on YouTube");
			if (options.type == "playlists") type = "playlist";
			if (options.type == "tracks" || options.type == "videos") type = "video";
			return await YouTube_Search(query, options.limit, type);
			break;

		case Service.audiofile:
			throw "Bro really thought they could search for audio files";
			break;
	}

	throw new Error("Service was not specified");
}

/**
 * Validate and get the service from a given URL.
 *
 * @returns Service or undefined
 */
export async function serviceFromURL(url: string): Promise<Service | undefined> {
	url = url.trim();
	if (url.length === 0) return;
	if (YouTube_Validate(url)) return Service.youtube;
	if (SoundCloud_Validate(url)) return Service.soundcloud;
	if (Spotify_Validate(url)) return Service.spotify;
	if (AudioFile_Validate(url)) return Service.audiofile;
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
			return SoundCloud_Info(url).catch((err) => {
				throw err;
			});

		case Service.spotify:
			return Spotify_Info(url);
			break;

		case Service.youtube:
			return YouTube_Info(url);
			break;

		case Service.audiofile:
			return AudioFile_Info(url, {});
			break;
	}

	throw new Error("Invalid service");
}

export { MusicTrack, MusicPlaylist };
export { SearchOptions, Audio, Author, MusicTrackConstructor, MusicPlaylistConstructor };
export { Service };
// export { SoundCloud };
// export { Spotify };
export { setKey, freeKey, getKey, setKeyFile, setKeys, refreshTokens };
export { searchGeniusSong, fetchGeniusSongLyrics, GeniusSong };
// export { YouTube, YouTubeSearch };
