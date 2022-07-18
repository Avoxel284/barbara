/**
 * Avoxel284 2022
 * Barbara Music Module
 *
 * Functions for getting/setting keys and other configuration
 */

import axios from "axios";
import fs from "fs";
import { authenticateKey } from "./auth";
import { debugLog, warnLog } from "./util";

const keys: any = {
	SOUNDCLOUD: {
		CLIENTID: "",
	},
	SPOTIFY: {
		CLIENTID: "",
		CLIENTSECRET: "",
		ACCESSTOKEN: "",
		TOKENTYPE: "",
		TOKENEXPIRY: "",
		MARKETCODE: "AU",
	},
	YOUTUBE: {
		COOKIE: "",
		INVIDIOUSSITE: "https://vid.puffyan.us",
	},
	GENIUS: {
		TOKEN: "",
		LYRICSCACHING: true,
	},
	CONFIG: {
		DEBUG: false,
		FILE: "",
		AUTOREFRESH: true,
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
	if (keys?.[k[0]]?.[k[1]] === undefined) throw new Error("Cannot find key to get: " + key);
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
	if (value === undefined) warnLog(`Value when setting ${k[0]}_${k[1]} is undefined!`);
	if (keys?.[k[0]]?.[k[1]] === undefined) throw new Error("Cannot find key to set: " + key);
	keys[k[0]][k[1]] = value;
	authenticateKey(k[0]);
}

/**
 * Set authentication keys in bulk. Note: will overwrite specified keys.
 * A full reference of key names can be found on the cheatsheet.
 *
 * **Use this function to set keys before invoking other Barbara-related stuff so Barbara can use the given keys.**
 *
 * @example
 * ```
 * setKeys({
 * 	// Supports underscore format...
 * 	"SOUNDCLOUD_CLIENTID": "1234567890",
 * 	// ... or hierarchical format
 * 	"SPOTIFY": {
 * 		CLIENTID: "1234567890"
 * 	}
 * })
 * ```
 *
 * @param ks Object containing keys
 */
export function setKeys(ks: object): void {
	for (let [a, b] of Object.entries(ks)) {
		a = a.toUpperCase();
		// underscore format
		if (a.includes("_") && typeof b !== "object") {
			let k = a.split("_");
			// Skip if doesn't exist
			k[0] = k[0].toUpperCase();
			k[1] = k[1].toUpperCase();
			if (keys[k[0]]?.[k[1]] === undefined) continue;
			if (b === undefined) warnLog(`Value when setting ${k[0]}_${k[1]} is undefined!`);
			keys[k[0]][k[1]] = b;
			authenticateKey(k[0]);
			continue;
		}
		// object format
		if (keys[a] === undefined) continue;
		for (let [c, v] of Object.entries(b)) {
			c = c.toUpperCase();
			// Skip if doesn't exist
			if (keys[a]?.[c] === undefined) continue;
			if (v === undefined) warnLog(`Value when setting ${a}_${c} is undefined!`);
			keys[a][c] = v;
			authenticateKey(a);
			continue;
		}
	}
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
				if (keys[a]?.[c] === undefined) continue;
				// Check if already set
				if (keys[a][c] && overwrite == false) continue;
				keys[a][c] = v;
				authenticateKey(a);
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
 *
 * // Get a better Invidious API and set it
 * barbara.setKey("YOUTUBE_INVIDIOUSAPI", await barbara.freeKey("YOUTUBE_INVIDIOUSAPI"));
 * ```
 *
 * Some code was ripped from play-dl
 * @async **Function is asynchronous!**
 */
export async function freeKey(key: string) {
	const k: string[] = key.split("_");
	if (keys?.[k[0]]?.[k[1]] == null) throw new Error("Cannot find key: " + key);

	if (k[0] === "SOUNDCLOUD") {
		if (k[1] === "CLIENTID") {
			const { data } = await axios.get("https://soundcloud.com/").catch((err: Error) => {
				console.error("An error occurred when attempting to fetch SoundCloud free key:");
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

	if (k[0] === "YOUTUBE") {
		if (k[1] === "INVIDIOUSSITE") {
			const { data } = await axios
				.get(`https://api.invidious.io/instances.json?pretty=0&sort_by=type,users`)
				.catch((err: Error) => {
					console.error("An error occurred when attempting to fetch Invidious api url:");
					throw err;
				});
			if (!data) return;

			const urls: string[] = [];
			data.forEach((a: any) => {
				if (a[1].api) urls.push(a[1].uri);
			});
			return urls[0];
		}
	}

	throw new Error("No free authentication key can be found");
}
