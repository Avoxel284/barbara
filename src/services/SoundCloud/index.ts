/**
 * Avoxel284 2022
 * Barbara Music Module / SoundCloud
 */

import { BarbaraType, MusicPlaylist, MusicTrack, Service } from "../../lib";
import axios from "axios";
import { MusicTrackFromSoundCloud, MusicPlaylistFromSoundCloud } from "./parse";
import { getKey } from "../../lib/config";

/** URL pattern for SoundCloud - ripped from play-dl */
export const SOUNDCLOUD_URL_PATTERN =
	/^(?:(https?):\/\/)?(?:(?:www|m)\.)?(api\.soundcloud\.com|soundcloud\.com|snd\.sc)\/(.*)$/;

/**
 * Returns {@link MusicTrack} or {@link MusicPlaylist} with data from SoundCloud from a given resource URL
 */
export async function SoundCloud_Info(url: string): Promise<MusicTrack | MusicPlaylist> {
	let clientId = await getKey("SOUNDCLOUD_CLIENTID");

	url = url.trim();
	if (!url.match(SOUNDCLOUD_URL_PATTERN))
		throw new Error(`Given URL is not a valid SoundCloud URL`);
	const { data } = await axios
		.get(`https://api-v2.soundcloud.com/resolve?url=${url}&client_id=${clientId}`)
		.catch((err: Error) => {
			throw err;
		});
	if (data.streamable === false) throw "SoundCloud track cannot be streamed";

	if (data.kind === "track") {
		return MusicTrackFromSoundCloud(data);
	}

	if (data.kind === "playlist") {
		return MusicPlaylistFromSoundCloud(data);
	}

	throw new Error("SoundCloud returned unknown resource.");
}

/**
 * Searches for a SoundCloud track or playlist and returns with an array of {@link MusicTrack} or {@link MusicPlaylist}
 *
 * **Note:** Limit minimum is 5 since SoundCloud includes premium-only (Go+) tracks in searches.
 * Attempting to stream from such would result in a preview stream which would only last ~15 seconds.
 * Increasing the limit increases the chances of finding a non-premium track.
 */
export async function SoundCloud_Search(
	query: string,
	limit: number = 20,
	type: "tracks" | "playlists" | "albums" = "tracks"
): Promise<MusicTrack[] | MusicPlaylist[]> {
	let clientId = await getKey("SOUNDCLOUD_CLIENTID");
	if (!clientId) throw new Error("SoundCloud Client ID is not set!");
	if (!query) throw new Error("No query given!");
	if (limit < 5) limit = 5;

	const { data } = await axios
		.get(
			`https://api-v2.soundcloud.com/search/${type}?q=${encodeURIComponent(
				query
			)}&client_id=${clientId}&limit=${limit}`
		)
		.catch((err: Error) => {
			throw err;
		});

	if (type === "tracks") {
		return data.collection
			.filter((d: any) => {
				if (d?.monetization_model && d?.monetization_model.includes("SUB")) return false;
				return true;
			})
			.map((d: any) => {
				return MusicTrackFromSoundCloud(d);
			});
	}

	if (type === "albums" || type === "playlists") {
		return data.collection.map((d: any) => MusicPlaylistFromSoundCloud(d));
	}

	throw new Error("SoundCloud returned unknown resource.");
}

/**
 * Check a URL and validate if it is a SoundCloud URL
 */
export function SoundCloud_Validate(url: string) {
	return url.match(SOUNDCLOUD_URL_PATTERN);
}
