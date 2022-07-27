/**
 * Avoxel284 2022
 * Barbara Music Module / Arbitrary
 */

import { BarbaraType, MusicPlaylist, MusicTrack, Service } from "../../lib";
import axios from "axios";
import { getKey } from "../../lib/config";
import { debugLog } from "../../lib/util";
import { MusicTrackFromAudioFile } from "./parse";
import metadata from "music-metadata";

const acceptedFileExtensions: string[] = ["mp3", "mp4", "ogg", "wav"];

/** Pattern for validating Audio file URLs */
export const AUDIOFILE_URL_PATTERN = new RegExp(
	`^(https?):\/\/(www.)?(.*?)\.(${acceptedFileExtensions.join("|")})$`
);

/**
 * Returns {@link MusicTrack} with data from a given audio file URL
 *
 * @param reqOptions Additional options to pass to Axios when creating request (Refer to Axios documentation)
 */
export async function AudioFile_Info(url: string, reqOptions: any): Promise<MusicTrack> {
	url = url.trim();
	if (!url) throw "Given AudioFile URL is null!";
	// if (!url.match(AUDIOFILE_URL_PATTERN))
	// 	throw "Given AudioFile URL is invalid or not an audio file.";
	// debugLog(data);

	const { data, headers } = await axios
		.get(url, { responseType: "stream", ...reqOptions })
		.catch((err) => {
			throw err;
		});
	if (!data) throw "Audio file does not contain any data";
	// if (!data?.meta?.format?.duration) throw "Failed to parse file metadata: Duration is null";

	debugLog(`AudioFile Content Type: ${headers["content-type"]}`);
	// headers["content-type"] = "audio/ogg"

	return MusicTrackFromAudioFile({
		url: url,
		data: data,
		headers: headers,
		// gonna leave duration as true for now
		meta: await metadata.parseStream(data, undefined, { duration: true }),
	});

	// call it unneccessary but at least all the data is in original data
	// and its neater/more modular this way
}

/**
 * Check a URL and validate if it is a Audio File URL
 */
export function AudioFile_Validate(url: string) {
	return true;
	return url.match(AUDIOFILE_URL_PATTERN);
}
