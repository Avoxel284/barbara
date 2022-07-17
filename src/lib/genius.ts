/**
 * Avoxel284 2022
 * Barbara Music Module
 */

import axios from "axios";
import { GeniusSong } from ".";
import { getKey } from "./config";
import { debugLog } from "./util";

/**
 * Cache for lyrics to make fetching lyrics faster
 */
const LYRICS_CACHE: any = {};

/**
 * Returns with song data from Genius API
 *
 * @param query Query to search song
 */
export async function searchGeniusSong(query: string): Promise<GeniusSong | undefined> {
	if (!getKey("GENIUS_TOKEN")) throw "Genius is not authenticated! (Token is null)";

	const { data } = await axios
		.get(`https://api.genius.com/search?q=${query}`, {
			headers: {
				Authorization: `Bearer ${getKey("GENIUS_TOKEN")}`,
				Accept: "application/json",
			},
		})
		.catch((err) => {
			throw err;
		});

	debugLog(`Searching for song on Genius :: query: ${query}`);
	debugLog(`Genius "hits":`, data?.response?.hits);

	let song = data?.response?.hits[0];
	if (song?.type != "song") return;
	song = song.result;

	return {
		lyrics: undefined,
		url: song.url,
		pyongs: song.pyongs_count,
		title: song.full_title,
		name: song.name,
		artist: {
			name: song.primary_artist.name,
			url: song.primary_artist.url,
			avatar: song.primary_artist.image_url,
			id: song.primary_artist.id,
			verified: song.primary_artist.is_verified,
		},
		thumbnail: song.song_art_image_url,
		id: song.id,
		lyricsState: song.lyrics_state,
	};
}

/**
 * Scrape lyrics data from song on Genius
 *
 * @param url Genius song friendly URL
 */
export async function fetchGeniusSongLyrics(url: string): Promise<string[] | null> {
	debugLog(`Genius Extract Song Lyrics URL: ${url}`);
	if (!url) return null;
	if (getKey("GENIUS_LYRICSCACHING") === true && LYRICS_CACHE[url]) return LYRICS_CACHE[url];

	let { data } = await axios.get(url).catch((err) => {
		throw err;
	});

	let json = data.split("window.__PRELOADED_STATE__ = JSON.parse('")[1].split("');")[0];

	if (!json) return null;

	try {
		json = JSON.parse(json.replace(/\\/g, ""));
	} catch (err) {
		debugLog(json);
		debugLog(err);
		json = null;
	}
	debugLog(json);
	if (!json) return null;

	let lyrics = json?.songPage?.lyricsData?.body?.children?.[0]?.children.filter((l: any) => {
		return typeof l == "string";
	});
	if (getKey("GENIUS_LYRICSCACHING") === true) LYRICS_CACHE[url] = lyrics;

	return lyrics;
}
