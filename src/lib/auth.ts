/**
 * Avoxel284 2022
 * Barbara Music Module
 *
 * Functions for authenticating keys
 */

import axios from "axios";
import { Service } from ".";
import { getKey } from "./config";
import { debugLog } from "./util";

export async function authenticateKey(key0: string) {
	if (key0 === "SPOTIFY") {
		let accessToken = getKey("SPOTIFY_ACCESSTOKEN");
		let clientId = getKey("SPOTIFY_CLIENTID");
		let clientSecret = getKey("SPOTIFY_CLIENTSECRET");
		if (accessToken) return;
		if (!clientId || !clientSecret) return;

		let { data } = await axios
			.post("https://accounts.spotify.com/api/token", {
				grant_type: "client_credentials",
				headers: {
					Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
				},
			})
			.catch((err) => {
				throw err;
			});

		return {
			SPOTIFY_CLIENTID: "",
			SPOTIFY_ACCESSTOKEN: data.access_token,
			// Allow a minute for refreshing the token
			SPOTIFY_TOKENEXPIRY: Date.now() + (data.expires_in - 1) * 1000,
			SPOTIFY_TOKENTYPE: data.token_type,
		};
	}

	return;
}

/**
 * Automatically refresh all authenticated service keys.
 * If `CONFIG_AUTOREFRESH` is true, this will occur automatically.
 */
export async function refreshTokens(service?: Service) {
	if (service === Service.spotify || !service) {
		authenticateKey("SPOTIFY");
	}
}

(async () => {
	if (getKey("CONFIG_AUTOREFRESH")) {
		// setInterval()
	}
})();
