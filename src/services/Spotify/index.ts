/**
 * Avoxel284 2022
 * Barbara Music Module / Spotify
 */

import { BarbaraType, MusicPlaylist, MusicTrack, Service } from "../../lib";
import axios from "axios";
import { MusicTrackFromSpotify, MusicPlaylistFromSpotify } from "./parse";
import { getKey, setKey } from "../../lib/config";
import { debugLog } from "../../lib/util";

/** URL pattern for Spotify - ripped from play-dl */
export const SPOTIFY_URL_PATTERN = /^((https:)?\/\/)?open.spotify.com\/(track|album|playlist)\//;

/**
 * Returns {@link MusicTrack} or {@link MusicPlaylist} with data from Spotify from a given resource URL
 */
export async function Spotify_Info(url: string): Promise<MusicTrack | MusicPlaylist> {
	url = url.trim();
	if (!url.match(SPOTIFY_URL_PATTERN)) throw new Error(`Given URL is not a valid Spotify URL`);

	if (url.includes("track/")) {
		const trackId = url.split("track/")[1].split("&")[0].split("?")[0];
		const { data } = await axios
			.get(`https://api.spotify.com/v1/tracks/${trackId}?market=${getKey("SPOTIFY_MARKETCODE")}`, {
				headers: {
					Authorization: `${getKey("SPOTIFY_TOKENTYPE")} ${getKey("SPOTIFY_ACCESSTOKEN")}`,
				},
			})
			.catch((err) => {
				throw err;
			});

		return MusicTrackFromSpotify(data);
	}

	if (url.includes("playlist/")) {
		const playlistId = url.split("playlist/")[1].split("&")[0].split("?")[0];
		const { data } = await axios
			.get(
				`https://api.spotify.com/v1/playlists/${playlistId}?market=${getKey("SPOTIFY_MARKETCODE")}`,
				{
					headers: {
						Authorization: `${getKey("SPOTIFY_TOKENTYPE")} ${getKey("SPOTIFY_ACCESSTOKEN")}`,
					},
				}
			)
			.catch((err) => {
				throw err;
			});

		return MusicPlaylistFromSpotify(data);
	}

	if (url.includes("album/")) {
		const albumID = url.split("album/")[1].split("&")[0].split("?")[0];
		const { data } = await axios
			.get(`https://api.spotify.com/v1/albums/${albumID}?market=${getKey("SPOTIFY_MARKETCODE")}`, {
				headers: {
					Authorization: `${getKey("SPOTIFY_TOKENTYPE")} ${getKey("SPOTIFY_ACCESSTOKEN")}`,
				},
			})
			.catch((err) => {
				throw err;
			});

		return MusicPlaylistFromSpotify(data, true);
	}

	throw new Error("Spotify returned unknown resource.");
}

/**
 * Searches for a Spotify track or playlist and returns with an array of {@link MusicTrack} or {@link MusicPlaylist}
 */
export async function Spotify_Search(
	query: string,
	limit: number = 5,
	type: "track" | "playlist" | "album" = "track"
) {
	if (!query) throw new Error("No query given!");
	if (limit > 50 || limit < 0) throw "Limit is out of range for Spotify (0 - 50)";

	const { data } = await axios
		.get(
			`https://api.spotify.com/v1/search?type=${type}&q=${query}&limit=${limit}&market=${getKey(
				"SPOTIFY_MARKETCODE"
			)}`,
			{
				headers: {
					Authorization: `${getKey("SPOTIFY_TOKENTYPE")} ${getKey("SPOTIFY_ACCESSTOKEN")}`,
				},
			}
		)
		.catch((err) => {
			throw err;
		});

	debugLog(`Spotify search data:`, data);

	if (type === "track") {
		return data.tracks.items.map((d: any) => MusicTrackFromSpotify(d));
	}

	if (type === "playlist") {
		return data.playlist.items.map((d: any) => MusicPlaylistFromSpotify(d));
	}

	if (type === "album") {
		return data.albums.items.map((d: any) => MusicPlaylistFromSpotify(d, true));
	}

	throw new Error("Spotify returned unknown resource.");
}

/**
 * Check a URL and validate if it is a Spotify URL
 */
export function Spotify_Validate(url: string) {
	return url.match(SPOTIFY_URL_PATTERN);
}
