/**
 * Avoxel284 2022
 * Barbara Music Module
 */

import axios from "axios";

const keys = {
	soundcloudClientId: "",
	spotifyAPIKey: "",
};

export type BarbaraKey = "SOUNDCLOUD_CLIENTID" | "SPOTIFY_APIKEY";

/**
 * Return an authentication key
 *
 * @param key Key identifier
 */
export function getKey(key: BarbaraKey) {
	if (key == "SOUNDCLOUD_CLIENTID") return keys["soundcloudClientId"];
	if (key == "SPOTIFY_APIKEY") return keys["spotifyAPIKey"];
	return "";
}

/**
 * Set an authentication key (e.g. Spotify API key).
 * Use this function before invoking other Barbara-related stuff so Barbara can use the given keys.
 *
 * @param key Key identifier
 * @param value Key value
 */
export function setKey(key: BarbaraKey, value: string): void {
	if (key == "SOUNDCLOUD_CLIENTID") keys["soundcloudClientId"] = value;
	if (key == "SPOTIFY_APIKEY") keys["spotifyAPIKey"] = value;
}

/**
 * Set a file path for reading authentication keys.
 * Note: Barbara will only read once from file every time its run
 *
 * @param path Relative file path
 */
export function setKeyFile(path: string): void {}

/** Log debug information? */
export function isDebug() {
	return true;
}

/**
 * Return a free authentication key (e.g. SoundCloud client ID)
 * You can use this when setting a key instead of providing your own (although it is still recommended).
 *
 * Some code was ripped from play-dl
 * @async
 */
export async function freeKeys(key: BarbaraKey) {
	if (key === "SOUNDCLOUD_CLIENTID") {
		const { data } = await axios.get("https://soundcloud.com/").catch((err: Error) => {
			throw err;
		});
		const urls: string[] = [];
		data.split('<script crossorigin src="').forEach((r: string) => {
			if (r.startsWith("https")) urls.push(r.split('"')[0]);
		});
		const { data: data2 } = await axios.get(urls[urls.length - 1]).catch((err: Error) => {
			throw err;
		});
		return data2.split(',client_id:"')[1].split('"')[0];
	}
}
