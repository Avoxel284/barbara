/**
 * Avoxel284 2022
 * Barbara Music Module
 *
 * Functions for authenticating keys
 */

import axios from "axios";
import { config } from "process";
import { Service } from ".";
import { getKey, setKey, setKeys } from "./config";
import { debugLog } from "./util";

export async function authenticateKey(key0: string): Promise<object | undefined> {
	if (key0 === "SPOTIFY") {
		let clientId = getKey("SPOTIFY_CLIENTID");
		let clientSecret = getKey("SPOTIFY_CLIENTSECRET");
		let accessToken = getKey("SPOTIFY_ACCESSTOKEN");
		if (accessToken || Date.now() < parseInt(getKey("SPOTIFY_TOKENEXPIRY").toString())) return;
		if (!clientId || !clientSecret) return;
		// prevent rerunning this function when already running
		setKey("SPOTIFY_ACCESSTOKEN", "_pending");

		let { data } = await axios
			.post("https://accounts.spotify.com/api/token", `grant_type=client_credentials`, {
				headers: {
					Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
					"Content-Type": "application/x-www-form-urlencoded",
				},
			})
			.catch((err) => {
				debugLog(err);
				// hacky, yea.. but it works
				return { data: null };
			});
		if (!data) return;

		setKeys({
			SPOTIFY_ACCESSTOKEN: data.access_token,
			// allow a minute for refreshing the token
			SPOTIFY_TOKENEXPIRY: Date.now() + (data.expires_in - 1) * 1000,
			SPOTIFY_TOKENTYPE: data.token_type,
		});
	}

	return;
}

/**
 * Automatically refresh all authenticated service keys.
 * If `CONFIG_AUTOREFRESH` is true, this will occur automatically when tokens are about to expire.
 */
export async function refreshTokens(service?: Service) {
	if (service === Service.spotify || !service) {
		setKeys(authenticateKey("SPOTIFY"));
	}
}
