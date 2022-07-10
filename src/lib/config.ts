/**
 * Avoxel284 2022
 * Barbara Music Module
 *
 * Functions for getting/setting keys and other configuration
 */

import axios from "axios";
import fs from "fs";
import { debugLog } from "./util";

const keys: any = {
	SOUNDCLOUD: {
		CLIENTID: "",
	},
	SPOTIFY: {
		APIKEY: "",
		CLIENTID: "",
		CLIENTSECRET: "",
		AUTHORIZATIONCODE: "",
		ACCESSTOKEN: "",
		REFRESHTOKEN: "",
		TOKENTYPE: "",
		EXPIRY: "",
		MARKETCODE: "",
	},
	YOUTUBE: {
		COOKIE: "",
	},
	CONFIG: {
		DEBUG: false,
		FILE: "",
	},
};

// type BarbaraKeyIdentifiers {
// "SoundCloudClientID" = "SOUNDCLOUD_CLIENTID",
// "SpotifyAPIKey" = "SPOTIFY_APIKEY",
// "SpotifyClientID" = "SPOTIFY_CLIENTID",
// "SpotifyClientSecret" = "SPOTIFY_CLIENTSECRET",
// "SpotifyAuthorizationCode" = "SPOTIFY_AUTHORIZATIONCODE",
// "SpotifyAccessToken" = "SPOTIFY_ACCESSTOKEN",
// "SpotifyRefreshToken" = "SPOTIFY_REFRESHTOKEN",
// "SpotifyTokenType" = "SPOTIFY_TOKENTYPE",
// "SpotifyTokenExpiry" = "SPOTIFY_TOKENEXPIRY",
// "SpotifyMarketCode" = "SPOTIFY_MARKETCODE",
// "ConfigDebug" = "CONFIG_DEBUG",
// "ConfigFile" = "CONFIG_FILE",
// }

/**
 * Return an authentication key.
 * A full reference of key names can be found on the cheatsheet.
 *
 * @example
 * ```
 * // Get key for Spotify Client ID
 * getKey("SPOTIFY_CLIENTID");
 * ```
 *
 * @param key Key identifier in the format of `<SERVICE>_<KEYIDENTIFIER>`
 */
export function getKey(key: string): boolean | string {
	const k: string[] = key.split("_");
	if (keys?.[k[0]]?.[k[1]] == null) throw new Error("Cannot find key to get: " + key);
	return keys[k[0]][k[1]];
}

/**
 * Set an authentication key (e.g. Spotify API key).
 * A full reference of key names can be found on the cheatsheet.
 *
 * **Use this function to set keys before invoking other Barbara-related stuff so Barbara can use the given keys.**
 *
 * @example
 * ```
 * // Set key for SoundCloud Client ID
 * setKey("SOUNDCLOUD_CLIENTID", "when will soundcloud open dev program again 🤔");
 * ```
 *
 * @param key Key identifier in the format of `<SERVICE>_<KEYIDENTIFIER>`
 * @param value Key value
 */
export function setKey(key: string, value: string): void {
	const k: string[] = key.split("_");
	if (keys?.[k[0]]?.[k[1]] == null) throw new Error("Cannot find key to set: " + key);
	keys[k[0]][k[1]] = value;
}

/**
 * Read a configuration file and append to authenticaton keys.
 *
 * @param path Path to configuration file
 * @param overwrite Overwrite keys that have been manually set? **Defaults to true.**
 */
export function setKeyFile(path: string, overwrite: boolean = true): void {
	if (!path || !path.match(/^(.+)\/([^\/]+)$/))
		throw "Given Barbara key configuration file path is invalid!";

	try {
		let fileContents = fs.readFileSync(path, { encoding: "utf-8" });
		if (!fileContents) throw "Specified configuration file is empty!";
		fileContents = JSON.parse(fileContents);

		for (let [a, b] of Object.entries(fileContents)) {
			a = a.toUpperCase();
			if (keys[a] === undefined) continue;
			for (let [c, v] of Object.entries(b)) {
				c = c.toUpperCase();
				// Skip if doesn't exist
				if (keys[a][c] === undefined) continue;
				// Check if already set
				if (keys[a][c] && overwrite == false) continue;
				keys[a][c] = v;
			}
		}
	} catch (err) {
		console.error(`An error occurred when attempting to read config file:`, err);
	}

	keys["CONFIG"]["FILE"] = path;
}

/**
 * Return a free authentication key (e.g. SoundCloud client ID).
 * You can use this when setting a key instead of providing your own.
 * A full reference of key names can be found on the cheatsheet.
 *
 * @example
 * ```
 * // Get a free SoundCloud client ID and set it
 * barbara.setKey("SOUNDCLOUD_CLIENTID", await barbara.freeKey("SOUNDCLOUD_CLIENTID"));
 * ```
 *
 * Some code was ripped from play-dl
 * @async **Function is asynchronous!**
 */
export async function freeKeys(key: string) {
	const k: string[] = key.split("_");
	if (keys?.[k[0]]?.[k[1]] == null) throw new Error("Cannot find key: " + key);

	if (k[0] === "SOUNDCLOUD") {
		if (k[1] === "CLIENTID") {
			const { data } = await axios.get("https://soundcloud.com/").catch((err: Error) => {
				console.error("soundcloud free key fail");
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

	throw new Error("No free authentication key can be found");
}